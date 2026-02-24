import { useEffect, useMemo, useRef, useState } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";
import { CommentSection } from "../components/posts/CommentSection";
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";

type BackendPost = {
    id: string;
    type: "lost" | "found";
    title: string;
    category_key: string;
    tag: string;
    description: string;
    publisher_username: string;
    location: { type: "Point"; coordinates: [number, number] };
    reports_count: number;
    image_url: string | null;
    created_at: string;
};

const API_URL = "http://127.0.0.1:8000/posts/all";

function mapCategory(key: string): LostFoundPost["category"] {
    const map: Record<string, LostFoundPost["category"]> = {
        electronics: "Electronics",
        documents:   "Documents",
        keys:        "Keys",
        clothing:    "Clothing",
        books:       "Books",
        wallets:     "Wallets / Cards",
        accessories: "Accessories",
        other:       "Other",
    };
    return map[key?.toLowerCase()] ?? "Other";
}

const BUILDINGS = [
    { name: "دانشکده شیمی",          pos: [35.70472076380309,  51.34991451434824] },
    { name: "کتابخانه مرکزی",         pos: [35.70467004563295,  51.35113801588977] },
    { name: "تالار ها",               pos: [35.704343101326025, 51.352110505538995] },
    { name: "ابن سینا",               pos: [35.70402074793266,  51.35222852272552] },
    { name: "سلف",                   pos: [35.703041123576284,  51.35201972022601] },
    { name: "دانشکده کامپیوتر",        pos: [35.7025496004159,   51.35110953004783] },
    { name: "دانشکده فیزیک",           pos: [35.70199306365006,  51.351754222503594] },
    { name: "دانشکده ریاضی",           pos: [35.70397542210906,  51.35034564923419] },
    { name: "دانشکده انرژی",           pos: [35.70536986300352,  51.3512772264833] },
    { name: "دانشکده مکانیک",          pos: [35.706404436949185, 51.35085504223541] },
    { name: "ساختمان آموزش",           pos: [35.70547032928061,  51.35066549143685] },
    { name: "دانشکده علم و مواد",       pos: [35.704757302206914, 51.35062966851281] },
    { name: "دانشکده صنایع",           pos: [35.70382073617354,  51.35053042678778] },
    { name: "دانشکده شیمی و نفت",      pos: [35.703087811104275, 51.35081339988114] },
    { name: "مجتمع خدمات دانش بنیان",  pos: [35.7024196803554,   51.3519949145686] },
    { name: "مسجد",                   pos: [35.70055353067872,   51.351587845001156] },
    { name: "دانشکده هوافضا",          pos: [35.70150875446248,  51.35339839071471] },
    { name: "شریف پلاس",              pos: [35.70324884779711,   51.352424645814985] },
    { name: "فست فود شریف",            pos: [35.70304731762322,   51.35244554705804] },
];

function nearestBuilding(lng: number, lat: number): string {
    let minDist = Infinity;
    let nearest = "دانشگاه شریف";
    for (const b of BUILDINGS) {
        const d = Math.hypot(b.pos[0] - lat, b.pos[1] - lng);
        if (d < minDist) { minDist = d; nearest = b.name; }
    }
    return nearest;
}

function mapBackendPost(item: BackendPost): LostFoundPost {
    return {
        id:            item.id,
        type:          item.type === "found" ? "FOUND" : "LOST",
        status:        "Open",
        category:      mapCategory(item.category_key),
        itemName:      item.title,
        tag:           item.tag ?? "",
        location:      item.location
                         ? nearestBuilding(item.location.coordinates[0], item.location.coordinates[1])
                         : "—",
        description:   item.description,
        publisherName: item.publisher_username,
        publishedAt:   new Date(item.created_at).toLocaleString("fa-IR"),
        imageUrl:      item.image_url ?? undefined,
    };
}

export function PostsPage() {
    const [items, setItems]               = useState<BackendPost[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);
                const data = await res.json() as BackendPost[];
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "خطای ناشناخته");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const posts      = useMemo(() => items.map(mapBackendPost), [items]);
    const activePost = posts.find(p => p.id === activePostId) ?? null;
    const isCommentOpen = activePostId !== null;

    function handleComment(id: string) {
        setActivePostId(prev => prev === id ? null : id);
        if (activePostId !== id) window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleReport(postId: string) {
        try {
            await fetch(`http://127.0.0.1:8000/interact/report/post/${postId}`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ reporter_username: "admin" }),
            });
        } catch {
        }
    }

    return (
        <div dir="rtl" className="min-h-screen flex">

            <div className="flex-1 transition-all duration-500 overflow-hidden min-w-0">
                <main className="mx-auto w-full px-3 sm:px-6 pt-[100px] sm:pt-[130px] pb-16">

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-60">
                            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">در حال دریافت پست‌ها...</span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-center py-10 text-red-400 text-sm space-y-1">
                            <div>❌ {error}</div>
                            <div className="opacity-50 text-xs">مطمئن شوید بک‌اند روی پورت 8000 در حال اجراست</div>
                        </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-20 opacity-40 text-sm">هیچ پستی یافت نشد</div>
                    )}

                    {!loading && !error && posts.length > 0 && (
                        <div
                            className={`
                                grid gap-5 transition-all duration-500
                                ${isCommentOpen
                                    ? "grid-cols-1 place-items-center"
                                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                }
                            `}
                            style={{ gridAutoRows: "1fr" }}
                        >
                            {posts
                                .filter(p => !isCommentOpen || p.id === activePostId)
                                .map(p => (

                                    <div
                                        key={p.id}
                                        className="flex flex-col [&>*]:flex-1 [&>*]:flex [&>*]:flex-col"
                                    >
                                        <PostCard
                                            post={p}
                                            onComment={handleComment}
                                            onReport={handleReport}
                                            onOpen={() => {}}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </main>
            </div>

            <aside
                className={`
                    hidden lg:flex flex-col shrink-0
                    transition-all duration-500 ease-in-out
                    border-r border-white/5
                    ${isCommentOpen
                        ? "w-[380px] xl:w-[420px] opacity-100"
                        : "w-0 opacity-0 pointer-events-none"
                    }
                `}
                style={{
                    background:     theme === "light" ? "rgba(255,255,255,0.85)" : "rgba(10,14,26,0.85)",
                    backdropFilter: "blur(40px)",
                    position:       "sticky",
                    top:            0,
                    height:         "100vh",
                }}
            >
                {activePost && (
                    <div className="flex-1 flex flex-col pt-[80px] overflow-hidden h-full">
                        <CommentSection
                            postId={activePost.id}
                            onClose={() => setActivePostId(null)}
                        />
                    </div>
                )}
            </aside>

            {isCommentOpen && activePost && (
                <MobileBottomSheet
                    postId={activePost.id}
                    onClose={() => setActivePostId(null)}
                    theme={theme}
                />
            )}
        </div>
    );
}


interface BottomSheetProps {
    postId: string;
    onClose: () => void;
    theme: string;
}

function MobileBottomSheet({ postId, onClose, theme }: BottomSheetProps) {
    const [visible, setVisible]   = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragY, setDragY]       = useState(0);
    const startYRef               = useRef(0);
    const isDark                  = theme !== "light";

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        document.body.classList.add("sheet-open");
        return () => {
            document.body.classList.remove("sheet-open");
        };
    }, []);

    function close() {
        setVisible(false);
        setTimeout(onClose, 320);
    }

    function onTouchStart(e: React.TouchEvent) {
        startYRef.current = e.touches[0].clientY;
        setDragging(true);
    }

    function onTouchMove(e: React.TouchEvent) {
        const delta = e.touches[0].clientY - startYRef.current;
        if (delta > 0) setDragY(delta);
    }

    function onTouchEnd() {
        setDragging(false);
        if (dragY > 120) {
            close();
        } else {
            setDragY(0);
        }
    }

    return (
        <div className="lg:hidden fixed inset-0 z-[200]">
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background:    "rgba(0,0,0,0.5)",
                    backdropFilter:"blur(4px)",
                    opacity:       visible ? 1 : 0,
                }}
                onClick={close}
            />

            <div
                className="absolute bottom-0 left-0 right-0 flex flex-col"
                style={{
                    height:        "88vh",
                    borderRadius:  "24px 24px 0 0",
                    background:    isDark ? "rgba(12,16,32,0.98)" : "rgba(248,250,253,0.98)",
                    backdropFilter:"blur(40px)",
                    border:        "1px solid var(--border-soft)",
                    borderBottom:  "none",
                    boxShadow:     "0 -8px 40px rgba(0,0,0,0.3)",
                    transform:     `translateY(${visible ? dragY : "100%"}px)`,
                    transition:    dragging ? "none" : "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
                    willChange:    "transform",
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div
                        className="w-10 h-1 rounded-full"
                        style={{ background: "var(--border-medium)" }}
                    />
                </div>

                <div
                    className="flex items-center justify-between px-5 py-3 shrink-0 border-b"
                    style={{ borderColor: "var(--border-soft)" }}
                >
                    <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>
                        نظرات
                    </span>
                    <button
                        onClick={close}
                        className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{
                            background: "var(--surface-2)",
                            color:      "var(--text-secondary)",
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <CommentSection postId={postId} onClose={close} hideHeader />
                </div>
            </div>
        </div>
    );
}
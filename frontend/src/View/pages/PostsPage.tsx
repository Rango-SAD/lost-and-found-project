import { useEffect, useMemo, useState } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";
import { CommentSection } from "../components/posts/CommentSection";
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";

type DbItem = {
    id: string;
    itemName: string;
    tag: string;
    category: string;
    description: string;
    status: string;
    photoName?: string;
    photoData?: string;
    date?: string;
    timestamp?: string;
};

const API_URL = "http://127.0.0.1:3001/lostAndFoundItems";

function mapCategory(dbCategory: string): LostFoundPost["category"] {
    const c = (dbCategory || "").toLowerCase();
    if (c === "electronics") return "Electronics" as LostFoundPost["category"];
    if (c === "documents") return "Documents" as LostFoundPost["category"];
    if (c === "keys") return "Keys" as LostFoundPost["category"];
    if (c === "clothing") return "Clothing" as LostFoundPost["category"];
    if (c === "books") return "Books" as LostFoundPost["category"];
    return "Other" as LostFoundPost["category"];
}

function inferTypeFromStatus(status: string): LostFoundPost["type"] {
    const s = (status || "").trim();
    if (s.includes("گم")) return "LOST";
    if (s.includes("پیدا")) return "FOUND";
    return "LOST";
}

function mapDbItemToPost(item: DbItem): LostFoundPost {
    const publishedAt = item.date
        ? item.date
        : item.timestamp
        ? new Date(item.timestamp).toLocaleString("fa-IR")
        : "";

    return {
        id: item.id,
        type: inferTypeFromStatus(item.status),
        status: "Open",
        category: mapCategory(item.category),
        itemName: item.itemName,
        tag: item.tag,
        location: "—",
        description: item.description,
        publisherName: "نام کاربری",
        publishedAt,
        imageUrl: item.photoData 
    };
}

export function PostsPage() {
    const [items, setItems] = useState<DbItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activePostId, setActivePostId] = useState<string | null>(null);

    const { theme } = useTheme();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
                const data = (await res.json()) as DbItem[];
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const posts: LostFoundPost[] = useMemo(() => items.map(mapDbItemToPost), [items]);
    const activePost = posts.find((p) => p.id === activePostId) ?? null;

    function handleComment(id: string) {
        setActivePostId((prev) => (prev === id ? null : id));
        if (activePostId !== id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function handleCloseComment() {
        setActivePostId(null);
    }

    const isCommentOpen = activePostId !== null;

    return (
        <div dir="rtl" className="min-h-screen flex bg-[var(--background)]">

            <div className="flex-1 transition-all duration-500 overflow-hidden">
                <main className="mx-auto w-full px-6 pt-[130px] pb-16">

                    {loading && <div className="text-center w-full py-10 opacity-60">در حال دریافت پست‌ها...</div>}
                    {!loading && error && <div className="text-center w-full py-10 text-red-400">خطا: {error}</div>}

                    {!loading && !error && (
                        <div className={`grid gap-8 justify-items-center transition-all duration-500 ${
                            isCommentOpen ? "grid-cols-1" : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        }`}>
                            
                            {posts
                                .filter(p => !isCommentOpen || p.id === activePostId)
                                .map((p) => (
                                <div
                                    key={p.id}
                                    className="w-full max-w-[550px] animate-in fade-in zoom-in duration-300"
                                >
                                    <PostCard
                                        post={p}
                                        onComment={handleComment}
                                        onReport={() => {}}
                                        onOpen={() => {}}
                                    />
                                    {isCommentOpen && (
                                        <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <aside
                className={`hidden lg:flex flex-col shrink-0 transition-all duration-500 ease-in-out border-r border-white/5
                    ${isCommentOpen ? "w-[450px] opacity-100" : "w-0 opacity-0 pointer-events-none"}
                `}
                style={{
                    background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(10,14,26,0.8)",
                    backdropFilter: "blur(40px)",
                    position: "sticky",
                    top: 0,
                    height: "100vh"
                }}
            >
                {activePost && (
                    <div className="flex-1 flex flex-col pt-[100px]">
                         <CommentSection postId={activePost.id} onClose={handleCloseComment} />
                    </div>
                )}
            </aside>

            {isCommentOpen && (
                <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-[var(--background)] overflow-y-auto pt-20">
                    <div className="p-4">
                        <PostCard post={activePost!} onComment={handleComment} onReport={()=>{}} onOpen={()=>{}} />
                    </div>
                    <div className="flex-1">
                        <CommentSection postId={activePost!.id} onClose={handleCloseComment} />
                    </div>
                </div>
            )}
        </div>
    );
}
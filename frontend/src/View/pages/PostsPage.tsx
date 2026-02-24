import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";
import { PostCard } from "../components/posts/PostCard";
import { CommentSection } from "../components/posts/CommentSection";
import { FilterBar } from "../components/posts/postPage/FilterBar";
import { MobileBottomSheet } from "../components/posts/postPage/MobileBottomSheet";
import { API_URL, mapBackendPost, type BackendPost, type FilterState } from "../components/posts/postPage/postsTypes";
import { PostFilters } from "../components/posts/PostFilters"; 
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";

type DbItem = {
    id: string; itemName: string; tag: string; category: string;
    description: string; status: string; photoData?: string;
    date?: string; timestamp?: string;
};

const API_URL = "http://127.0.0.1:3001/lostAndFoundItems";

export function PostsPage() {
    const [items, setItems]               = useState<BackendPost[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { theme } = useTheme();
    const isDark = theme !== "light";

    const [filters, setFilters] = useState<FilterState>({
        searchText: "", filterCategory: "", filterLocation: "", filterType: "",
    });

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true); setError(null);
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

    const posts = useMemo(() => items.map(mapBackendPost), [items]);

    const locationOptions = useMemo(() =>
        Array.from(new Set(posts.map(p => p.location).filter(l => l && l !== "—"))).sort()
    , [posts]);

    const filteredPosts = useMemo(() => {
        const { searchText, filterCategory, filterLocation, filterType } = filters;
        return posts.filter(p => {
            const q = searchText.trim().toLowerCase();
            if (q && !p.itemName.toLowerCase().includes(q) &&
                     !p.description?.toLowerCase().includes(q) &&
                     !p.tag?.toLowerCase().includes(q)) return false;
            if (filterCategory && p.category !== filterCategory) return false;
            if (filterLocation && p.location !== filterLocation) return false;
            if (filterType && p.type !== filterType.toUpperCase()) return false;
            return true;
        });
    }, [posts, filters]);

    const activePost    = posts.find(p => p.id === activePostId) ?? null;
    const isCommentOpen = activePostId !== null;

    function handleComment(id: string) {
        setActivePostId(prev => prev === id ? null : id);
        if (activePostId !== id) window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleReport(postId: string) {
        try {
            await fetch(`http://127.0.0.1:8000/interact/report/post/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reporter_username: "admin" }),
            });
        } catch {}
    }

    return (
        <div dir="rtl" className="min-h-screen flex">

            <div className="flex-1 transition-all duration-500 overflow-hidden min-w-0">
                <main className="mx-auto w-full px-3 sm:px-6 pt-[90px] sm:pt-[110px] pb-16">

                    {!isCommentOpen && (
                        <FilterBar
                            filters={filters}
                            onChange={partial => setFilters(prev => ({ ...prev, ...partial }))}
                            locationOptions={locationOptions}
                            totalCount={posts.length}
                            filteredCount={filteredPosts.length}
                            isDark={isDark}
                        />
                    )}

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
                    {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
                        <div className="text-center py-20 opacity-40 text-sm">نتیجه‌ای برای فیلتر انتخابی یافت نشد</div>
                    )}

                    {!loading && !error && filteredPosts.length > 0 && (
                        <div
                            className={`grid gap-5 transition-all duration-500 ${
                                isCommentOpen
                                    ? "grid-cols-1 place-items-center"
                                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            }`}
                            style={{ gridAutoRows: "1fr" }}
                        >
                            {filteredPosts
                                .filter(p => !isCommentOpen || p.id === activePostId)
                                .map(p => (
                                    <div key={p.id} className="flex flex-col [&>*]:flex-1 [&>*]:flex [&>*]:flex-col">
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
                    
                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-20 opacity-30 text-lg italic">موردی یافت نشد...</div>
                    )}
                </main>
            </div>

            <aside
                className={`hidden lg:flex flex-col shrink-0 transition-all duration-500 ease-in-out border-r border-white/5 ${
                    isCommentOpen ? "w-[380px] xl:w-[420px] opacity-100" : "w-0 opacity-0 pointer-events-none"
                }`}
                style={{
                    background:     isDark ? "rgba(10,14,26,0.85)" : "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(40px)",
                    position:       "sticky",
                    top:            0,
                    height:         "100vh",
                }}
            >
                {activePost && (
                    <div className="flex-1 flex flex-col pt-[80px] overflow-hidden h-full">
                        <CommentSection postId={activePost.id} onClose={() => setActivePostId(null)} />
                    </div>
                )}
            </aside>

            {isCommentOpen && activePost && (
                <MobileBottomSheet postId={activePost.id} onClose={() => setActivePostId(null)} theme={theme} />
            )}
        </div>
    );
}

function mapDbItemToPost(item: DbItem): LostFoundPost {
    const publishedAt = item.date || (item.timestamp ? new Date(item.timestamp).toLocaleString("fa-IR") : "");
    const mapCategory = (dbCat: string): LostFoundPost["category"] => {
        const c = (dbCat || "").toLowerCase();
        if (["electronics", "documents", "keys", "clothing", "books"].includes(c)) {
            return (c.charAt(0).toUpperCase() + c.slice(1)) as any;
        }
        return "Other";
    };

    return {
        id: item.id,
        type: (item.status || "").includes("گم") ? "LOST" : "FOUND",
        status: "Open",
        category: mapCategory(item.category),
        itemName: item.itemName,
        tag: item.tag,
        location: "—",
        description: item.description,
        publisherName: "کاربر",
        publishedAt,
        imageUrl: item.photoData
    };
}
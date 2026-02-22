import { useEffect, useMemo, useState } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";
import { CommentSection } from "../components/posts/CommentSection";
import { PostFilters } from "../components/posts/PostFilters"; 
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";

type DbItem = {
    id: string; itemName: string; tag: string; category: string;
    description: string; status: string; photoData?: string;
    date?: string; timestamp?: string;
};

const API_URL = "http://127.0.0.1:3001/lostAndFoundItems";

export function PostsPage() {
    const [items, setItems] = useState<DbItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activePostId, setActivePostId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { theme } = useTheme();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("خطا در برقراری ارتباط با سرور");
                const data = await res.json();
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

    const filteredPosts = useMemo(() => {
        return items
            .map(mapDbItemToPost)
            .filter(post => {
                const matchesSearch = 
                    post.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    post.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
                return matchesSearch && matchesCategory;
            });
    }, [items, searchQuery, selectedCategory]);

    const activePost = filteredPosts.find((p) => p.id === activePostId) ?? null;
    const isCommentOpen = activePostId !== null;

    function handleComment(id: string) {
        setActivePostId((prev) => (prev === id ? null : id));
        if (activePostId !== id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <div dir="rtl" className="min-h-screen flex bg-[var(--background)] transition-colors duration-500">

            <div className={`flex-1 transition-all duration-500 overflow-hidden ${isCommentOpen ? "lg:mr-[450px]" : ""}`}>
                <main className="mx-auto w-full px-6 pt-[130px] pb-16">
                    
                    {!isCommentOpen && (
                        <PostFilters 
                            searchQuery={searchQuery} 
                            setSearchQuery={setSearchQuery} 
                            selectedCategory={selectedCategory} 
                            setSelectedCategory={setSelectedCategory} 
                        />
                    )}

                    {loading && <div className="text-center w-full py-10 opacity-60">در حال دریافت پست‌ها...</div>}
                    {!loading && error && <div className="text-center w-full py-10 text-red-400">{error}</div>}

                    {!loading && !error && (
                        <div className={`grid gap-8 justify-items-center transition-all duration-500 ${
                            isCommentOpen ? "grid-cols-1" : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        }`}>
                            {filteredPosts
                                .filter(p => !isCommentOpen || p.id === activePostId)
                                .map((p) => (
                                    <div key={p.id} className="w-full max-w-[550px] animate-in fade-in duration-500">
                                        <PostCard post={p} onComment={handleComment} onReport={()=>{}} onOpen={()=>{}} />
                                    </div>
                                ))}
                        </div>
                    )}
                    
                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-20 opacity-30 text-lg italic">موردی یافت نشد...</div>
                    )}
                </main>
            </div>

            <aside
                className={`hidden lg:flex flex-col fixed top-0 right-0 h-full z-50 transition-all duration-500 border-l border-white/5
                    ${isCommentOpen ? "w-[450px] translate-x-0" : "w-0 translate-x-full"}
                `}
                style={{
                    background: theme === "light" ? "rgba(255,255,255,0.85)" : "rgba(10,14,26,0.85)",
                    backdropFilter: "blur(40px)",
                }}
            >
                {activePost && (
                    <div className="flex-1 flex flex-col pt-20 h-full overflow-hidden">
                        <CommentSection postId={activePost.id} onClose={() => setActivePostId(null)} />
                    </div>
                )}
            </aside>

            {isCommentOpen && activePost && (
                <div className="lg:hidden fixed inset-0 z-[150] flex flex-col bg-[var(--background)]">
                    <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                        <span className="font-bold text-sm">بخش نظرات</span>
                        <button onClick={() => setActivePostId(null)} className="p-2 bg-white/5 rounded-full text-xs">بستن</button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 opacity-80"><PostCard post={activePost} onComment={()=>{}} onReport={()=>{}} onOpen={()=>{}} /></div>
                        <CommentSection postId={activePost.id} onClose={() => setActivePostId(null)} />
                    </div>
                </div>
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
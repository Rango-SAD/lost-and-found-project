import { useEffect, useMemo, useState } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";
import { CommentSection } from "../components/posts/CommentSection";
import { PostFilters } from "../components/posts/PostFilters"; 
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";
import { interactionFacade } from "../../Infrastructure/Utility/interactionFacade";

type DbItem = {
    id: string; itemName: string; tag: string; category: string;
    description: string; status: string; photoData?: string;
    date?: string; timestamp?: string;
};

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
                setError(null);
                const data = await interactionFacade.getAllPosts();
                if (!cancelled) {
                    // اطمینان از اینکه دیتا حتما آرایه است
                    setItems(Array.isArray(data) ? data : []);
                }
            } catch (e: any) {
                if (!cancelled) {
                    console.error("Fetch error:", e);
                    setError(e.message || "خطا در دریافت پست‌ها");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const filteredPosts = useMemo(() => {
        try {
            return items
                .map(mapDbItemToPost)
                .filter(post => {
                    const matchesSearch = 
                        (post.itemName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (post.description || "").toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                });
        } catch (err) {
            console.error("Mapping error:", err);
            return [];
        }
    }, [items, searchQuery, selectedCategory]);

    const activePost = filteredPosts.find((p) => p.id === activePostId) ?? null;
    const isCommentOpen = activePostId !== null;

    function handleComment(id: string) {
        setActivePostId((prev) => (prev === id ? null : id));
    }

    async function handleReportPost(postId: string) {
        try {
            await interactionFacade.reportContent("post", postId);
            alert("گزارش ثبت شد");
        } catch (err: any) {
            const errorMessage = typeof err === 'object' ? JSON.stringify(err) : err;
            console.error("Report Error Details:", err); 
            alert("خطا: " + (err.message || errorMessage));
        }
    }

    return (
        <div dir="rtl" className="min-h-screen flex bg-[var(--background)]">
            <div className={`flex-1 transition-all duration-500 ${isCommentOpen ? "lg:mr-[450px]" : ""}`}>
                <main className="mx-auto w-full px-6 pt-[130px] pb-16">
                    <PostFilters 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        selectedCategory={selectedCategory} 
                        setSelectedCategory={setSelectedCategory} 
                    />
                    
                    {loading && <div className="text-center py-10 opacity-50">در حال بارگذاری...</div>}
                    
                    {!loading && error && (
                        <div className="text-center py-10 text-red-500 bg-red-500/10 rounded-xl">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div className={`grid gap-8 justify-items-center ${
                            isCommentOpen ? "grid-cols-1" : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        }`}>
                            {filteredPosts
                                .filter(p => !isCommentOpen || p.id === activePostId)
                                .map((p) => (
                                    <div key={p.id} className="w-full max-w-[550px]">
                                        <PostCard 
                                            post={p} 
                                            onComment={handleComment} 
                                            onReport={() => handleReportPost(p.id)} 
                                            onOpen={() => {}} 
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                </main>
            </div>

            {isCommentOpen && activePost && (
                <aside className="fixed top-0 right-0 h-full w-[450px] z-50 border-l border-white/5 bg-slate-900/90 backdrop-blur-xl pt-20">
                    <CommentSection postId={activePost.id} onClose={() => setActivePostId(null)} />
                </aside>
            )}
        </div>
    );
}

function mapDbItemToPost(item: any): LostFoundPost {
    // استفاده از مقادیر پیش‌فرض برای جلوگیری از ارور در صورت نبود فیلد در دیتابیس
    const publishedAt = item?.date || (item?.timestamp ? new Date(item.timestamp).toLocaleString("fa-IR") : "نامشخص");
    
    return {
        id: item?._id || item?.id || Math.random().toString(),
        type: (item?.status || "").toLowerCase().includes("lost") ? "LOST" : "FOUND",
        status: "Open",
        category: (item?.category) || "Other",
        itemName: item?.itemName || "بدون نام",
        tag: item?.tag || "",
        location: "دانشگاه شریف",
        description: item?.description || "",
        publisherName: "کاربر",
        publishedAt,
        imageUrl: item?.photoData
    };
}
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext";
import { PostCard } from "../components/posts/PostCard";
import { CommentSection } from "../components/posts/CommentSection";
import { FilterBar } from "../components/posts/postPage/FilterBar";
import { MobileBottomSheet } from "../components/posts/postPage/MobileBottomSheet";
import { API_URL, mapBackendPost, type BackendPost, type FilterState } from "../components/posts/postPage/postsTypes";
import { interactionFacade } from "../../Infrastructure/Utility/interactionFacade";

export function PostsPage() {
    const [items, setItems]               = useState<BackendPost[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [activePostId, setActivePostId] = useState<string | null>(null);
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
                if (!res.ok) throw new Error(`Status: ${res.status}`);
                const data = await res.json() as BackendPost[];
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Error");
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

    async function handleReport(postId: string) {
    try {
        const res = await interactionFacade.reportContent("post", postId);
        
        if (res.deleted) {
            setItems(prev => prev.filter(item => (item._id || item.id) !== postId));
            if (activePostId === postId) setActivePostId(null);
        }
        
    } catch (err: any) {
        alert(err.message); 
        throw err; 
    }
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
                    {loading && <div className="py-20 text-center opacity-60">در حال دریافت...</div>}
                    {!loading && error && <div className="text-center py-10 text-red-400">❌ {error}</div>}
                    <div className={`grid gap-5 transition-all duration-500 ${isCommentOpen ? "grid-cols-1 place-items-center" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                        {filteredPosts
                            .filter(p => !isCommentOpen || p.id === activePostId)
                            .map(p => (
                                <div key={p.id} className="flex flex-col w-full">
                                    <PostCard 
                                        post={p} 
                                        onComment={(id) => setActivePostId(prev => prev === id ? null : id)} 
                                        onReport={handleReport} 
                                        onOpen={() => {}} 
                                    />
                                </div>
                            ))
                        }
                    </div>
                </main>
            </div>
            {isCommentOpen && activePost && (
                <aside className="hidden lg:flex flex-col shrink-0 w-[380px] xl:w-[420px] sticky top-0 h-100vh border-r border-white/5"
                    style={{ background: isDark ? "rgba(10,14,26,0.85)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(40px)" }}>
                    <div className="flex-1 flex flex-col pt-[80px] overflow-hidden">
                        <CommentSection postId={activePost.id} onClose={() => setActivePostId(null)} />
                    </div>
                </aside>
            )}
            {isCommentOpen && activePost && (
                <MobileBottomSheet postId={activePost.id} onClose={() => setActivePostId(null)} theme={theme} />
            )}
        </div>
    );
}
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
                if (!res.ok)
                    throw new Error(`API error: ${res.status} ${res.statusText}`);
                const data = (await res.json()) as DbItem[];
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled)
                    setError(e instanceof Error ? e.message : "Unknown error");
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
    }

    function handleCloseComment() {
        setActivePostId(null);
    }

    const isCommentOpen = activePostId !== null;

    return (
        <div dir="rtl" className="min-h-screen flex">

            <div
                className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-500"
                style={{ paddingLeft: isCommentOpen ? "0" : "0" }}
            >
                <main className="mx-auto w-full px-6 pt-[130px] pb-16">

                    {loading && (
                        <div className="text-white text-center w-full py-10">
                            در حال دریافت پست‌ها...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-white text-center w-full py-10">
                            خطا در دریافت داده‌ها: {error}
                            <div className="opacity-80 mt-2 text-sm">
                                مطمئن شو json-server روی 3001 اجراست.
                            </div>
                        </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <div className="text-white text-center w-full py-10">
                            موردی جهت نمایش یافت نشد.
                        </div>
                    )}

                    {!loading && !error && posts.length > 0 && (
                        <div
                            className={[
                                "grid gap-8 justify-items-center transition-all duration-500",
                                isCommentOpen
                                    ? "grid-cols-1"
                                    : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                            ].join(" ")}
                        >
                            {posts.map((p) => (
                                <div
                                    key={p.id}
                                    className="w-full transition-all duration-500"
                                    style={{

                                        opacity:
                                            !isCommentOpen || p.id === activePostId
                                                ? 1
                                                : 0.45,
                                        transform:
                                            p.id === activePostId
                                                ? "scale(1.02)"
                                                : "scale(1)",
                                        filter:
                                            isCommentOpen && p.id !== activePostId
                                                ? "blur(0.5px) grayscale(30%)"
                                                : "none",
                                        maxWidth: isCommentOpen
                                            ? p.id === activePostId
                                                ? "600px"
                                                : "520px"
                                            : "520px",
                                        margin: "0 auto",
                                    }}
                                >
                                    <PostCard
                                        post={p}
                                        onComment={handleComment}
                                        onReport={(id) => console.log("report", id)}
                                        onOpen={(id) => console.log("open", id)}
                                    />

                                    {p.id === activePostId && (
                                        <div
                                            className="mt-3 h-[2px] w-3/4 mx-auto rounded-full"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(60,120,255,0.6), transparent)",
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <div
                className={[
                    "hidden lg:flex flex-col shrink-0 overflow-hidden",
                    "transition-all duration-500 ease-in-out",
                    isCommentOpen ? "w-[420px] opacity-100" : "w-0 opacity-0 pointer-events-none",
                ].join(" ")}
                style={{
                    background:
                        theme === "light"
                            ? "rgba(244,247,251,0.97)"
                            : "rgba(14,20,38,0.97)",
                    backdropFilter: "blur(32px)",
                    borderRight: "1px solid var(--border-soft)",
                    boxShadow: isCommentOpen ? "-4px 0 40px var(--overlay)" : "none",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    paddingTop: "80px",
                }}
            >
                {activePost && (
                    <CommentSection
                        postId={activePost.id}
                        onClose={handleCloseComment}
                    />
                )}
            </div>

            {activePost && (
                <div
                    className="lg:hidden fixed inset-0 z-50 flex flex-col overflow-y-auto"
                    style={{
                        background:
                            theme === "light"
                                ? "rgba(244,247,251,0.99)"
                                : "rgba(14,20,38,0.99)",
                    }}
                >
                    <div className="px-4 pt-24 pb-3 shrink-0">
                        <PostCard
                            post={activePost}
                            onComment={handleComment}
                            onReport={(id) => console.log("report", id)}
                            onOpen={(id) => console.log("open", id)}
                        />
                    </div>
                    <CommentSection
                        postId={activePost.id}
                        onClose={handleCloseComment}
                    />
                </div>
            )}
        </div>
    );
}

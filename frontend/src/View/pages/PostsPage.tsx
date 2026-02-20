import { useEffect, useMemo, useState } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";

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
    const publishedAt =
        item.date
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
        return () => {
            cancelled = true;
        };
    }, []);

    const posts: LostFoundPost[] = useMemo(() => items.map(mapDbItemToPost), [items]);

    return (
        <div dir="rtl" className="min-h-screen">
            <div className="app-scroll h-full overflow-y-auto overflow-x-hidden pr-2 w-full">
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
                                مطمئن شو json-server روی 3001 اجراست و آدرس API درست است.
                            </div>
                        </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <div className="text-white text-center w-full py-10">
                            موردی جهت نمایش یافت نشد.
                        </div>
                    )}

                    {!loading && !error && posts.length > 0 && (
                        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                            {posts.map((p) => (
                                <PostCard
                                    key={p.id}
                                    post={p}
                                    onContact={(id) => console.log("contact", id)}
                                    onReport={(id) => console.log("report", id)}
                                    onOpen={(id) => console.log("open", id)}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

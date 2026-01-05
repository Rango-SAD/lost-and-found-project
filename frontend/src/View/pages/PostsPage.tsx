import { useMemo } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";



export function PostsPage() {

    // sample data
    const posts: LostFoundPost[] = useMemo(
        () => [
            {
                id: "1",
                type: "LOST",
                status: "Open",
                category: "Keys",
                itemName: "کلید",
                tag: "فلزی",
                location: "پارکینگ",
                description: "متن نمونه توضیحات متن نمونه توضیحات متن نمونه توضیحات",
                publisherName: "علی",
                publishedAt: "۲۰:۳۰ - ۱۴۰۴/۱۰/۱۰",
            },
            {
                id: "2",
                type: "FOUND",
                status: "Open",
                category: "Books",
                itemName: "کتاب",
                tag: "ریاضی",
                location: "کتابخانه",
                description: "متن نمونه توضیحات متن نمونه توضیحات متن نمونه توضیحات",
                publisherName: "هادی",
                publishedAt: "۲۰:۳۰ - ۱۴۰۴/۱۰/۱۰",
            },
            {
                id: "3",
                type: "LOST",
                status: "Open",
                category: "Electronics",
                itemName: "هندزفری",
                tag: "سفید",
                location: "دانشکده کامپیوتر",
                description: "هندزفری سفید رنگ توی لابی دانشکده کامپیوتر گم شده.",
                publisherName: "نام کاربری",
                publishedAt: "۲۰:۳۰ - ۱۴۰۴/۱۰/۱۰",
            },
            {
                id: "4",
                type: "LOST",
                status: "Open",
                category: "Clothing",
                itemName: "ژاکت",
                tag: "سرمه‌ای",
                location: "کلاس",
                description: "متن نمونه توضیحات متن نمونه توضیحات متن نمونه توضیحات",
                publisherName: "نام کاربری",
                publishedAt: "۲۰:۳۰ - ۱۴۰۴/۱۰/۱۰",
            },
            {
                id: "5",
                type: "FOUND",
                status: "Open",
                category: "Documents",
                itemName: "کارت دانشجویی",
                tag: "کارت",
                location: "ورودی",
                description: "متن نمونه توضیحات متن نمونه توضیحات متن نمونه توضیحات",
                publisherName: "نام کاربری",
                publishedAt: "۲۰:۳۰ - ۱۴۰۴/۱۰/۱۰",
            },
            {
                id: "6",
                type: "LOST",
                status: "Open",
                category: "Accessories",
                itemName: "ساعت",
                tag: "مشکی",
                location: "سلف",
                description: "متن نمونه توضیحات متن نمونه توضیحات متن نمونه توضیحات",
                publisherName: "نام کاربری",
                publishedAt: "۲۰:۳۰ - ۱۴۰۴/۱۰/۱۰",
            },
        ],
        []
    );

    return (
        <div dir="rtl"
             className="min-h-screen flex items-center justify-center bg-[linear-gradient(45deg,rgba(18,24,43,0.5)_0%,rgba(16,21,39,0.77)_0%,rgba(15,19,36,1)_63%,rgba(14,18,34,0.77)_100%,rgba(11,15,26,0)_100%)]">
            {/* Fixed full background */}
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#0b0f1a,#12182b,#0f1324)]"/>

            <div
                className="app-scroll h-full overflow-y-auto overflow-x-hidden pr-2"
            >
                {/* CONTENT: padded so it never goes under header */}
                <main className="mx-auto w-full px-6 pt-[130px] pb-16">
                    {/* Grid: 3 / 2 / 1 */}
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
                </main>
            </div>

        </div>
    );
}

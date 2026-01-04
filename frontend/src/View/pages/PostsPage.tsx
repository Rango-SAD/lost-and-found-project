import { useMemo } from "react";
import type { LostFoundPost } from "../../Domain/Entities/LostFoundPost";
import { PostCard } from "../components/posts/PostCard";

import logo from "../assets/logo.png";

const HEADER_H = 110;

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
        <div dir="rtl" className="min-h-screen">
            {/* Fixed full background */}
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#0b0f1a,#12182b,#0f1324)]"/>

            {/* Header (fixed) */}
            <header
                className="fixed top-0 left-0 right-0 z-50"
                style={{height: HEADER_H}}
            >
                <div className="h-full w-full bg-[#0b0f1a]/70 backdrop-blur-2xl">
                    <div className="mx-auto h-full w-full px-10 pt-6">
                        <div className="flex items-start justify-between">
                            {/* Right: bigger logo */}
                            <div className="flex items-center">
                                <img
                                    src={logo}
                                    alt="لوگو"
                                    className="h-16 w-auto select-none"
                                />
                            </div>

                            {/* Left: exit + profile */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="rounded-full bg-white/8 px-4 py-2 text-ink-1 ring-1 ring-white/10 hover:bg-white/10"
                                    onClick={() => console.log("exit")}
                                    title="خروج"
                                >
                                    خروج
                                </button>

                                <div
                                    className="flex items-center gap-3 rounded-full bg-white/8 px-4 py-2 ring-1 ring-white/10">
                                    <div
                                        className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 text-ink-1">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path
                                                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                opacity="0.9"
                                            />
                                            <path
                                                d="M20 20a8 8 0 1 0-16 0"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                opacity="0.9"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-ink-0">نام کاربری</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 h-px w-full bg-white/10"/>
                    </div>
                </div>
            </header>

            {/* CONTENT: padded so it never goes under header */}
            <main className="mx-auto w-full px-6 pt-[130px] pb-16">
                {/* Grid: 3 / 2 / 1 */}
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
    );
}

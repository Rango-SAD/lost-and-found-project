import { useState } from "react";
import { useToast } from "../ui/ToastProvider.tsx";
import { cn } from "../../../Infrastructure/Utility/cn";
import { CategoryBadge } from "./CategoryBadge";
import type { LostFoundPost } from "../../../Domain/Entities/LostFoundPost";
import { useTheme } from "../../../Infrastructure/Contexts/ThemeContext";

function typeTitleFa(type: LostFoundPost["type"]) {
    return type === "LOST" ? "گم‌شده" : "پیدا شده";
}

type Props = {
    post: LostFoundPost;
    onComment?: (id: string) => void;
    onReport?: (id: string) => void;
    onOpen?: (id: string) => void;
};

export function PostCard({ post, onComment, onReport, onOpen }: Props) {
    const [reportOpen, setReportOpen] = useState(false);
    const { theme } = useTheme();
    const toast = useToast();

    return (
        <>
            <div
                dir="rtl"
                className={cn(
                    "group relative w-full max-w-[520px] rounded-[34px] overflow-hidden",
                    "border transition-all duration-200"
                )}
                style={{
                    background:
                        theme === "light"
                            ? "rgba(244, 247, 251, 0.85)"
                            : "rgba(18, 24, 43, 0.85)",
                    backdropFilter: "blur(28px)",
                    borderColor: "var(--border-soft)",
                    boxShadow: "0 20px 60px var(--overlay)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                        theme === "light"
                            ? "rgba(60,100,180,0.55)"
                            : "rgba(255,255,255,0.55)";
                    e.currentTarget.style.boxShadow =
                        "0 0 0 1px rgba(255,255,255,0.20), 0 28px 85px rgba(0,0,0,0.55), 0 0 36px rgba(232,236,255,0.35)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-soft)";
                    e.currentTarget.style.boxShadow = "0 20px 60px var(--overlay)";
                }}
                onClick={!reportOpen && onOpen ? () => onOpen(post.id) : undefined}
                role={onOpen ? "button" : undefined}
                tabIndex={onOpen ? 0 : undefined}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
                    <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <div className="relative px-7 pt-6 pb-5">
                    <div
                        className="text-center text-[15px] font-semibold"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {typeTitleFa(post.type)}
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_180px] gap-5">
                        <div className="min-w-0">
                            <div className="flex justify-start">
                                <CategoryBadge category={post.category} />
                            </div>

                            <div className="mt-4 space-y-3 text-right text-[14px]">
                                <div className="truncate">
                                    <span style={{ color: "var(--text-muted)" }}>نام آیتم</span>
                                    <span className="mx-2" style={{ color: "var(--divider)" }}>|</span>
                                    <span style={{ color: "var(--text-primary)" }}>{post.itemName}</span>
                                </div>

                                <div className="truncate">
                                    <span style={{ color: "var(--text-muted)" }}>#تگ</span>
                                    <span className="mx-2" style={{ color: "var(--divider)" }}>|</span>
                                    <span style={{ color: "var(--text-primary)" }}>{post.tag ?? "—"}</span>
                                </div>

                                <div className="truncate">
                                    <span style={{ color: "var(--text-muted)" }}>لوکیشن</span>
                                    <span className="mx-2" style={{ color: "var(--divider)" }}>|</span>
                                    <span style={{ color: "var(--text-primary)" }}>{post.location}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "relative h-[120px] w-[180px] overflow-hidden rounded-[26px] ring-1"
                            )}
                            style={{
                                background: "var(--surface-2)",
                                borderColor: "var(--border-soft)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0">
                                <div
                                    className="absolute -top-10 -left-10 h-40 w-40 rounded-full blur-2xl"
                                    style={{ background: "var(--surface-3)" }}
                                />
                                <div
                                    className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-2xl"
                                    style={{ background: "var(--surface-2)" }}
                                />
                            </div>

                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.itemName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="grid h-full w-full place-items-center"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            opacity="0.8"
                                        />
                                        <path
                                            d="M7 15l2-2 2 2 3-3 4 4"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            opacity="0.8"
                                        />
                                        <path
                                            d="M9 10.2a1.2 1.2 0 1 0 0 .1"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            opacity="0.8"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 h-px w-full" style={{ background: "var(--divider)" }} />

                    <div className="mt-5 grid grid-cols-[1fr_210px] gap-5">
                        <div className="min-w-0 text-right">
                            <div
                                className="text-[13px] leading-7"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {post.description ?? "متن نمونه توضیحات..."}
                            </div>
                        </div>

                        <div className="flex items-start justify-end gap-3">
                            <div className="text-right leading-5">
                                <div
                                    className="text-[14px] font-semibold"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {post.publisherName ?? "نام کاربری"}
                                </div>
                                <div className="mt-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    زمان انتشار
                                    <span className="mx-2" style={{ color: "var(--divider)" }}>|</span>
                                    <span style={{ color: "var(--text-secondary)" }}>
                                        {post.publishedAt ?? "—"}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="grid h-10 w-10 place-items-center rounded-full ring-1"
                                style={{
                                    background: "var(--surface-2)",
                                    borderColor: "var(--border-soft)",
                                }}
                            >
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
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onComment?.(post.id);
                            }}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-6 text-[14px] font-semibold transition-all"
                            style={{
                                background: "rgba(15,82,186,0.18)",
                                border: "1px solid var(--border-medium)",
                                color: "var(--text-primary)",
                            }}
                            aria-label="کامنت"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>کامنت</span>
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setReportOpen(true);
                            }}
                            className="h-11 flex-1 rounded-full px-6 text-[14px] font-semibold transition-all"
                            style={{
                                background: "rgba(184,58,45,0.18)",
                                border: "1px solid var(--border-medium)",
                                color: "var(--text-primary)",
                            }}
                        >
                            ریپورت
                        </button>
                    </div>
                </div>
            </div>

            {reportOpen ? (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    onClick={() => setReportOpen(false)}
                >
                    <div
                        className="absolute inset-0 backdrop-blur-sm"
                        style={{ background: "var(--overlay)" }}
                    />

                    <div
                        className={cn("relative w-full max-w-[420px] rounded-[26px] p-6")}
                        style={{
                            background:
                                theme === "light"
                                    ? "rgba(244, 247, 251, 0.92)"
                                    : "rgba(18, 24, 43, 0.92)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid var(--border-medium)",
                            boxShadow: "0 25px 80px var(--overlay)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className="text-right text-[14px] font-semibold"
                            style={{ color: "var(--text-primary)" }}
                        >
                            آیا از ریپورت این آگهی مطمئن هستید؟
                        </div>
                        <div
                            className="mt-2 text-right text-[13px]"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            این اقدام برای بررسی محتوا ثبت می‌شود.
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                className="h-11 flex-1 rounded-full px-6 text-[14px] font-semibold"
                                style={{
                                    background: "rgba(15,82,186,0.18)",
                                    border: "1px solid var(--border-medium)",
                                    color: "var(--text-primary)",
                                }}
                                onClick={() => setReportOpen(false)}
                            >
                                خیر
                            </button>

                            <button
                                type="button"
                                className="h-11 flex-1 rounded-full px-6 text-[14px] font-semibold"
                                style={{
                                    background: "rgba(184,58,45,0.18)",
                                    border: "1px solid var(--border-medium)",
                                    color: "var(--text-primary)",
                                }}
                                onClick={() => {
                                    setReportOpen(false);
                                    onReport?.(post.id);
                                    toast.push("ریپورت شما ثبت شد");
                                }}
                            >
                                بله
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

import {useState} from "react";
import {useToast} from "../ui/ToastProvider.tsx";
import { cn } from "../../../Infrastructure/Utility/cn";
import { GlassSurface } from "../ui/GlassSurface";
import { CategoryBadge } from "./CategoryBadge";
import type { LostFoundPost } from "../../../Domain/Entities/LostFoundPost";

function typeTitleFa(type: LostFoundPost["type"]) {
    return type === "LOST" ? "گمشده" : "پیدا شده";
}

type Props = {
    post: LostFoundPost;
    onContact?: (id: string, message: string) => void;
    onReport?: (id: string) => void;
    onOpen?: (id: string) => void;
};

export function PostCard({ post, onContact, onReport, onOpen }: Props) {
    const [reportOpen, setReportOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [message, setMessage] = useState("");

    const toast = useToast();
    return (
        <>
        <GlassSurface
            dir="rtl"
            className={cn(
                "group w-full max-w-[520px] rounded-[34px]",
                // base border (unchanged)
                "border border-[rgba(160,177,225,0.10)]",
                // base shadow (unchanged)
                "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                "transition-all duration-200",
                // HOVER: very visible light border + strong glow
                "hover:border-[rgba(255,255,255,0.55)]",
                "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.20),0_28px_85px_rgba(0,0,0,0.55),0_0_36px_rgba(232,236,255,0.35)]"
            )}

            onClick={!reportOpen && onOpen ? () => onOpen(post.id) : undefined}
            role={onOpen ? "button" : undefined}
            tabIndex={onOpen ? 0 : undefined}
        >
            <div className="px-7 pt-6 pb-5">
                {/* Title */}
                <div className="text-center text-[15px] font-semibold text-[#aab0d6]">
                    {typeTitleFa(post.type)}
                </div>

                {/* Top row: badge (left) + image (right) + meta (center-left) */}
                <div className="mt-5 grid grid-cols-[1fr_180px] gap-5">
                    {/* Left column: badge + meta */}
                    <div className="min-w-0">
                        <div className="flex justify-start">
                            <CategoryBadge category={post.category} />
                        </div>

                        <div className="mt-4 space-y-3 text-right text-[14px]">
                            <div className="truncate">
                                <span className="text-[#6f76a8]">نام آیتم</span>
                                <span className="mx-2 text-white/15">|</span>
                                <span className="text-[#e8ecff]">{post.itemName}</span>
                            </div>

                            <div className="truncate">
                                <span className="text-[#6f76a8]">#تگ</span>
                                <span className="mx-2 text-white/15">|</span>
                                <span className="text-[#e8ecff]">{post.tag ?? "—"}</span>
                            </div>

                            <div className="truncate">
                                <span className="text-[#6f76a8]">لوکیشن</span>
                                <span className="mx-2 text-white/15">|</span>
                                <span className="text-[#e8ecff]">{post.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right column: image */}
                    <div
                        className={cn(
                            "relative h-[120px] w-[180px] overflow-hidden rounded-[26px]",
                            "bg-white/6 ring-1 ring-white/10",
                            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                        )}
                    >
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
                        </div>

                        {post.imageUrl ? (
                            <img
                                src={post.imageUrl}
                                alt={post.itemName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center text-white/35">
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

                {/* Divider */}
                <div className="mt-6 h-px w-full bg-white/10" />

                {/* Bottom row: description (left) + profile (right) */}
                <div className="mt-5 grid grid-cols-[1fr_210px] gap-5">
                    {/* Description */}
                    <div className="min-w-0 text-right">
                        <div className="text-[13px] leading-7 text-[#aab0d6]">
                            {post.description ?? "متن نمونه توضیحات..."}
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="flex items-start justify-end gap-3">
                        <div className="text-right leading-5">
                            <div className="text-[14px] font-semibold text-[#e8ecff]">
                                {post.publisherName ?? "نام کاربری"}
                            </div>
                            <div className="mt-2 text-[12px] text-[#6f76a8]">
                                زمان انتشار
                                <span className="mx-2 text-white/15">|</span>
                                <span className="text-[#aab0d6]">{post.publishedAt ?? "—"}</span>
                            </div>
                        </div>

                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/6 ring-1 ring-white/10">
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

                {/* Buttons row */}
                <div className="mt-6 flex items-center justify-between gap-4">
                    {/* Contact */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setContactOpen(true);
                        }}
                        className={cn(
                            "h-[47px] flex-1 rounded-full px-6 text-[14px] font-semibold",
                            "transition-all duration-200",
                            // fill: #0F52BA 15%
                            "bg-[rgba(15,82,186,0.15)]",
                            // stroke: white 14%
                            "ring-1 ring-[rgba(255,255,255,0.14)]",
                            "text-[#e8ecff]",
                            // hover
                            "hover:bg-[rgba(15,82,186,0.22)] hover:ring-[rgba(255,255,255,0.20)]"
                        )}
                    >
                        ارتباط با صاحب
                    </button>

                    {/* Report */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setReportOpen(true);
                        }}
                        className={cn(
                            "h-[47px] flex-1 rounded-full px-6 text-[14px] font-semibold",
                            "transition-all duration-200",
                            // fill: #B83A2D 15%
                            "bg-[rgba(184,58,45,0.15)]",
                            // stroke: white 14%
                            "ring-1 ring-[rgba(255,255,255,0.14)]",
                            "text-[#e8ecff]",
                            // hover
                            "hover:bg-[rgba(184,58,45,0.22)] hover:ring-[rgba(255,255,255,0.20)]"
                        )}
                    >
                        ریپورت
                    </button>
                </div>
            </div>
        </GlassSurface>

    {/* Report confirmation modal */}
    {reportOpen ? (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            onClick={() => setReportOpen(false)}
        >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

            <div
                className={cn(
                    "relative w-full max-w-[420px] rounded-[26px]",
                    "border border-[rgba(160,177,225,0.14)]",
                    "bg-white/10 backdrop-blur-2xl",
                    "ring-1 ring-white/10",
                    "shadow-[0_25px_80px_rgba(0,0,0,0.55)]",
                    "p-6"
                )}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="text-right text-[14px] font-semibold text-[#e8ecff]">
                    آیا از ریپورت این آگهی مطمئن هستید؟
                </div>
                <div className="mt-2 text-right text-[13px] text-[#aab0d6]">
                    این اقدام برای بررسی محتوا ثبت می‌شود.
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        className={cn(
                            "h-11 flex-1 rounded-full px-6 text-[14px] font-semibold",
                            "bg-[rgba(15,82,186,0.18)] text-[#e8ecff]",
                            "ring-1 ring-[rgba(255,255,255,0.14)]",
                            "hover:bg-[rgba(15,82,186,0.26)] hover:ring-[rgba(255,255,255,0.20)]"
                        )}
                        onClick={() => setReportOpen(false)}
                    >
                        خیر
                    </button>

                    <button
                        type="button"
                        className={cn(
                            "h-11 flex-1 rounded-full px-6 text-[14px] font-semibold",
                            "bg-[rgba(184,58,45,0.18)] text-[#e8ecff]",
                            "ring-1 ring-[rgba(255,255,255,0.14)]",
                            "hover:bg-[rgba(184,58,45,0.26)] hover:ring-[rgba(255,255,255,0.20)]"
                        )}
                        onClick={() => {
                            setReportOpen(false);
                            onReport?.(post.id);
                            toast.push("ریپورت شما ثبت شد")
                        }}
                    >
                        بله
                    </button>
                </div>
            </div>
        </div>
    ) : null}
            {/* Contact modal */}
            {contactOpen ? (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    onClick={() => setContactOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

                    <div
                        className={cn(
                            "relative w-full max-w-[440px] rounded-[26px]",
                            "border border-[rgba(160,177,225,0.14)]",
                            "bg-white/10 backdrop-blur-2xl",
                            "ring-1 ring-white/10",
                            "shadow-[0_25px_80px_rgba(0,0,0,0.55)]",
                            "p-6"
                        )}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Title */}
                        <div className="text-right text-[14px] font-semibold text-[#e8ecff]">
                            ارسال پیام
                        </div>

                        {/* Textarea */}
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="متن پیام"
                            className={cn(
                                "mt-4 w-full resize-none rounded-[18px] px-4 py-3",
                                "bg-white/8 backdrop-blur-xl",
                                "border border-[rgba(160,177,225,0.14)]",
                                "ring-1 ring-white/10",
                                "text-[13px] text-[#e8ecff]",
                                "placeholder:text-[#6f76a8]",
                                "focus:outline-none focus:ring-2 focus:ring-white/20"
                            )}
                            rows={4}
                        />

                        {/* Buttons */}
                        <div className="mt-6 flex items-center justify-between gap-3">
                            {/* Send */}
                            <button
                                type="button"
                                disabled={!message.trim()}
                                className={cn(
                                    "h-11 flex-1 rounded-full px-6 text-[14px] font-semibold",
                                    "transition-all",
                                    message.trim()
                                        ? "bg-[rgba(15,82,186,0.18)] text-[#e8ecff] ring-1 ring-[rgba(255,255,255,0.18)] hover:bg-[rgba(15,82,186,0.26)]"
                                        : "bg-white/6 text-[#6f76a8] ring-1 ring-white/10 cursor-not-allowed"
                                )}
                                onClick={() => {
                                    onContact?.(post.id, message.trim());
                                    setContactOpen(false);
                                    setMessage("");
                                    toast.push("پیام شما ارسال شد");
                                }}
                            >
                                ارسال
                            </button>

                            {/* Cancel */}
                            <button
                                type="button"
                                className={cn(
                                    "h-11 flex-1 rounded-full px-6 text-[14px] font-semibold",
                                    "bg-[rgba(184,58,45,0.18)] text-[#e8ecff]",
                                    "ring-1 ring-[rgba(255,255,255,0.14)]",
                                    "hover:bg-[rgba(184,58,45,0.26)] hover:ring-[rgba(255,255,255,0.20)]"
                                )}
                                onClick={() => {
                                    setContactOpen(false);
                                    setMessage("");
                                }}
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

        </>
    );
}

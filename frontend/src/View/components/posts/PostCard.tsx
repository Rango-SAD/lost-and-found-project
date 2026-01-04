import { cn } from "../../../Infrastructure/Utility/cn";
import { GlassSurface } from "../ui/GlassSurface";
import { CategoryBadge } from "./CategoryBadge";
import type { LostFoundPost } from "../../../Domain/Entities/LostFoundPost";

function typeTitleFa(type: LostFoundPost["type"]) {
    return type === "LOST" ? "آگهی گمشده" : "آگهی پیدا شده";
}

type Props = {
    post: LostFoundPost;
    onContact?: (id: string) => void;
    onReport?: (id: string) => void;
    onOpen?: (id: string) => void;
};

export function PostCard({ post, onContact, onReport, onOpen }: Props) {
    return (
        <GlassSurface
            dir="rtl"
            className={cn(
                "w-full max-w-[520px] rounded-[34px]",
                // FIXED border for all posts: #a0b1e1 10%
                "border border-[rgba(160,177,225,0.10)]",
                // glass + shadow
                "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                "transition-all duration-200",
                // hover: slightly lighter border + glow
                "hover:border-[rgba(160,177,225,0.22)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.42)]"
            )}
            onClick={onOpen ? () => onOpen(post.id) : undefined}
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
                            onContact?.(post.id);
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
                            onReport?.(post.id);
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
    );
}

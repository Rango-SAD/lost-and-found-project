import { useState } from "react";
import { cn } from "../../../Infrastructure/Utility/cn";
import { useTheme } from "../../../Infrastructure/Contexts/ThemeContext";

export type Comment = {
    id: string;
    username: string;
    avatarUrl?: string;
    text: string;
    createdAt: string;
};

type Props = {
    postId: string;
    onClose: () => void;
};

const MOCK_COMMENTS: Comment[] = [
    {
        id: "1",
        username: "علی محمدی",
        text: "این وسیله رو دیدم، لطفاً تماس بگیرید",
        createdAt: "۱۴۰۴/۱۲/۰۱",
    },
    {
        id: "2",
        username: "سارا رضایی",
        text: "ممنون از اطلاع‌رسانی",
        createdAt: "۱۴۰۴/۱۲/۰۲",
    },
];

export function CommentSection({ postId, onClose }: Props) {
    const { theme } = useTheme();
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [text, setText] = useState("");

    const currentUser = { username: "کاربر ", avatarUrl: undefined };

    function handleSubmit() {
        const trimmed = text.trim();
        if (!trimmed) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            username: currentUser.username,
            avatarUrl: currentUser.avatarUrl,
            text: trimmed,
            createdAt: new Date().toLocaleDateString("fa-IR"),
        };

        setComments((prev) => [...prev, newComment]);
        setText("");
    }

    const surface =
        theme === "light"
            ? "rgba(244,247,251,0.97)"
            : "rgba(18,24,43,0.97)";

    return (
        <div
            dir="rtl"
            className="flex flex-col h-full"
            style={{
                background: surface,
                borderLeft: "1px solid var(--border-soft)",
            }}
        >
            <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "var(--border-soft)" }}
            >
                <span
                    className="text-[15px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                >
                    کامنت‌ها
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    className="grid h-8 w-8 place-items-center rounded-full transition-opacity hover:opacity-70"
                    style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border-soft)",
                        color: "var(--text-secondary)",
                    }}
                    aria-label="بستن کامنت‌ها"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M1 1l12 12M13 1L1 13"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {comments.length === 0 && (
                    <div
                        className="text-center text-[13px] pt-8"
                        style={{ color: "var(--text-muted)" }}
                    >
                        هنوز کامنتی ثبت نشده
                    </div>
                )}
                {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                        <div
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1"
                            style={{
                                background: "var(--surface-2)",
                                borderColor: "var(--border-soft)",
                                color: "var(--text-muted)",
                            }}
                        >
                            {c.avatarUrl ? (
                                <img
                                    src={c.avatarUrl}
                                    alt={c.username}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                    />
                                    <path
                                        d="M20 20a8 8 0 1 0-16 0"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                    />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1 text-right">
                            <div
                                className="text-[13px] font-semibold"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {c.username}
                            </div>
                            <div
                                className="mt-1 text-[13px] leading-6"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {c.text}
                            </div>
                            <div
                                className="mt-1 text-[11px]"
                                style={{ color: "var(--text-muted)" }}
                            >
                                {c.createdAt}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="px-5 py-4 border-t"
                style={{ borderColor: "var(--border-soft)" }}
            >
                <div className="flex items-end gap-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="کامنت بنویس..."
                        rows={2}
                        className={cn(
                            "flex-1 resize-none rounded-[14px] px-4 py-2 text-[13px]",
                            "focus:outline-none focus:ring-1"
                        )}
                        style={{
                            background:
                                theme === "light"
                                    ? "rgba(233,238,245,0.7)"
                                    : "rgba(255,255,255,0.07)",
                            border: "1px solid var(--border-medium)",
                            color: "var(--text-primary)",
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <button
                        type="button"
                        disabled={!text.trim()}
                        onClick={handleSubmit}
                        className="h-10 rounded-full px-5 text-[13px] font-semibold transition-opacity disabled:opacity-40"
                        style={{
                            background: "rgba(15,82,186,0.22)",
                            border: "1px solid var(--border-medium)",
                            color: "var(--text-primary)",
                        }}
                    >
                        ارسال
                    </button>
                </div>
            </div>
        </div>
    );
}

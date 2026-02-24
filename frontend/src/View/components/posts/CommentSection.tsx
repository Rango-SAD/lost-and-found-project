import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../Infrastructure/Contexts/ThemeContext";

interface Comment {
    id: string;
    post_id: string;
    publisher_username: string;
    content: string;
    parent_id: string | null;
    reports_count: number;
    created_at: string;
}

interface Props {
    postId: string;
    onClose: () => void;
    hideHeader?: boolean;
}

const API = "http://127.0.0.1:8000";

export function CommentSection({ postId, onClose, hideHeader = false }: Props) {
    const [comments, setComments]     = useState<Comment[]>([]);
    const [loading, setLoading]       = useState(true);
    const [text, setText]             = useState("");
    const [replyTo, setReplyTo]       = useState<Comment | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [sendError, setSendError]   = useState<string | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { theme } = useTheme();
    const isDark = theme !== "light";

    async function fetchComments() {
        try {
            setLoading(true);
            const res = await fetch(`${API}/interact/comments/${postId}`);
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch {
            setComments([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchComments(); }, [postId]);

    function handleReply(c: Comment) {
        setReplyTo(c);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    async function handleSubmit() {
        if (!text.trim() || submitting) return;
        setSendError(null);
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/interact/comment`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post_id:            postId,
                    publisher_username: "admin",
                    content:            text.trim(),
                    parent_id:          replyTo?.id ?? null,
                }),
            });
            if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);
            setText("");
            setReplyTo(null);
            await fetchComments();
        } catch (e) {
            setSendError(e instanceof Error ? e.message : "خطا در ارسال");
        } finally {
            setSubmitting(false);
        }
    }

    const roots     = comments.filter(c => !c.parent_id);
    const repliesOf = (id: string) => comments.filter(c => c.parent_id === id);

    return (
        <div dir="rtl" className="flex flex-col h-full" style={{ color: "var(--text-primary)" }}>

            {!hideHeader && (
            <div
                className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-soft)" }}
            >
                <span className="font-bold text-base">
                    نظرات {!loading && `(${comments.length})`}
                </span>
                <button
                    onClick={onClose}
                    className="text-xl leading-none opacity-60 hover:opacity-100 transition-opacity"
                >✕</button>
            </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {!loading && comments.length === 0 && (
                    <p className="text-center opacity-40 text-sm py-8">هنوز نظری ثبت نشده</p>
                )}
                {!loading && roots.map(root => (
                    <div key={root.id} className="space-y-2">
                        <CommentBubble
                            comment={root}
                            onReply={handleReply}
                            isDark={isDark}
                        />
                        {repliesOf(root.id).map(reply => (
                            <div key={reply.id} className="mr-6 relative">
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-0.5 rounded-full"
                                    style={{ background: "rgba(59,130,246,0.25)" }}
                                />
                                <div className="pr-3">
                                    <CommentBubble
                                        comment={reply}
                                        onReply={handleReply}
                                        isDark={isDark}
                                        parentContent={
                                            comments.find(c => c.id === reply.parent_id)?.content
                                        }
                                        parentUsername={
                                            comments.find(c => c.id === reply.parent_id)?.publisher_username
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div
                className="px-4 pb-5 pt-3 border-t shrink-0"
                style={{ borderColor: "var(--border-soft)" }}
            >
                {replyTo && (
                    <div
                        className="flex items-start justify-between rounded-xl px-3 py-2 mb-2 text-xs"
                        style={{
                            background:  isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.07)",
                            borderRight: "3px solid #3b82f6",
                        }}
                    >
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-blue-400 font-semibold">{replyTo.publisher_username}</span>
                            <span className="truncate opacity-70">{replyTo.content}</span>
                        </div>
                        <button
                            onClick={() => setReplyTo(null)}
                            className="mr-3 text-sm opacity-50 hover:opacity-100 shrink-0 mt-0.5"
                        >✕</button>
                    </div>
                )}

                {sendError && (
                    <p className="text-xs text-red-400 mb-2 text-center">{sendError}</p>
                )}

                <div className="flex gap-2 items-end">
                    <textarea
                        ref={inputRef}
                        rows={2}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder={
                            replyTo
                                ? `ریپلای به ${replyTo.publisher_username}...`
                                : "نظر خود را بنویسید..."
                        }
                        className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                        style={{
                            background: "var(--surface-2)",
                            border:     "1px solid var(--border-soft)",
                            color:      "var(--text-primary)",
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !text.trim()}
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                        style={{ background: "#3b82f6" }}
                    >
                        {submitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 19V5M5 12l7-7 7 7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


interface BubbleProps {
    comment: Comment;
    onReply: (c: Comment) => void;
    isDark: boolean;
    parentContent?: string;
    parentUsername?: string;
}

function CommentBubble({ comment, onReply, isDark, parentContent, parentUsername }: BubbleProps) {
    const [menuOpen, setMenuOpen]       = useState(false);
    const [hovered, setHovered]         = useState(false);
    const [reportOpen, setReportOpen]   = useState(false);
    const [reporting, setReporting]     = useState(false);
    const [reported, setReported]       = useState(false);

    async function submitReport() {
        setReporting(true);
        try {
            await fetch(`http://127.0.0.1:8000/interact/report/comment/${comment.id}`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ reporter_username: "admin" }),
            });
            setReported(true);
        } catch {
        } finally {
            setReporting(false);
            setReportOpen(false);
        }
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
        >
            <div
                className="rounded-2xl px-4 py-3 text-sm"
                style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    border:     "1px solid var(--border-soft)",
                }}
            >
                {parentContent && (
                    <div
                        className="rounded-lg px-3 py-2 mb-2 text-xs"
                        style={{
                            background:  isDark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.07)",
                            borderRight: "3px solid #3b82f6",
                        }}
                    >
                        <span className="text-blue-400 font-semibold block mb-0.5">{parentUsername}</span>
                        <span className="line-clamp-2 opacity-70">{parentContent}</span>
                    </div>
                )}

                <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                        {comment.publisher_username}
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-40">
                            {new Date(comment.created_at).toLocaleString("fa-IR", {
                                hour: "2-digit", minute: "2-digit",
                            })}
                        </span>

                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(v => !v)}
                                className="w-5 h-5 flex items-center justify-center rounded-full transition-all opacity-0 group-hover:opacity-100"
                                style={{
                                    opacity:    hovered ? 0.6 : 0,
                                    color:      "var(--text-muted)",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="5"  cy="12" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="19" cy="12" r="2" />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div
                                    className="absolute left-0 top-6 z-20 rounded-xl overflow-hidden text-xs shadow-xl"
                                    style={{
                                        minWidth:   "110px",
                                        background: isDark ? "rgba(20,26,46,0.97)" : "rgba(255,255,255,0.97)",
                                        border:     "1px solid var(--border-medium)",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onReply(comment);
                                        }}
                                        className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-blue-500/10 transition-colors text-right"
                                        style={{ color: "#3b82f6" }}
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="9 17 4 12 9 7" />
                                            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                                        </svg>
                                        ریپلای
                                    </button>
                                    <div style={{ height: "1px", background: "var(--border-soft)" }} />
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setReportOpen(true);
                                        }}
                                        className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-red-500/10 transition-colors text-right"
                                        style={{ color: reported ? "#aaa" : "#f43f5e" }}
                                        disabled={reported}
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5">
                                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                            <line x1="4" y1="22" x2="4" y2="15" />
                                        </svg>
                                        {reported ? "گزارش شد ✓" : "ریپورت"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
                    {comment.content}
                </p>
            </div>

            {reportOpen && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    onClick={() => setReportOpen(false)}
                >
                    <div className="absolute inset-0 backdrop-blur-sm"
                        style={{ background: "rgba(0,0,0,0.5)" }} />

                    <div
                        className="relative w-full max-w-[360px] rounded-[24px] p-6"
                        style={{
                            background:     isDark ? "rgba(18,24,43,0.97)" : "rgba(244,247,251,0.97)",
                            backdropFilter: "blur(24px)",
                            border:         "1px solid var(--border-medium)",
                            boxShadow:      "0 25px 80px rgba(0,0,0,0.4)",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(244,63,94,0.12)" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                    stroke="#f43f5e" strokeWidth="2" strokeLinecap="round">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                    <line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center text-[15px] font-semibold mb-2"
                            style={{ color: "var(--text-primary)" }}>
                            ریپورت کامنت
                        </div>
                        <div className="text-center text-[13px] mb-1"
                            style={{ color: "var(--text-secondary)" }}>
                            آیا از گزارش این نظر مطمئن هستید؟
                        </div>

                        <div className="mt-3 mb-5 px-3 py-2 rounded-xl text-xs line-clamp-2 text-right"
                            style={{
                                background:  isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                border:      "1px solid var(--border-soft)",
                                color:       "var(--text-muted)",
                            }}>
                            "{comment.content}"
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setReportOpen(false)}
                                className="flex-1 h-11 rounded-full text-[14px] font-semibold transition-all"
                                style={{
                                    background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                                    border:     "1px solid var(--border-soft)",
                                    color:      "var(--text-secondary)",
                                }}
                            >
                                لغو
                            </button>
                            <button
                                onClick={submitReport}
                                disabled={reporting}
                                className="flex-1 h-11 rounded-full text-[14px] font-semibold transition-all disabled:opacity-60"
                                style={{
                                    background: "rgba(244,63,94,0.18)",
                                    border:     "1px solid rgba(244,63,94,0.4)",
                                    color:      "#f43f5e",
                                }}
                            >
                                {reporting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        در حال ارسال...
                                    </span>
                                ) : "بله، ریپورت کن"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
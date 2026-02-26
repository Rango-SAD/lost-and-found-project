import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../Infrastructure/Contexts/ThemeContext";
import { MoreVertical, AlertTriangle } from "lucide-react";
import { interactionFacade } from "../../../Infrastructure/Utility/interactionFacade";

interface Comment {
    id: string; post_id: string; publisher_username: string;
    content: string; parent_id: string | null;
    reports_count: number; created_at: string;
}

interface Props {
    postId: string;
    onClose: () => void;
    hideHeader?: boolean;
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export function CommentSection({ postId, onClose, hideHeader = false }: Props) {
    const [comments, setComments]     = useState<Comment[]>([]);
    const [loading, setLoading]       = useState(true);
    const [text, setText]             = useState("");
    const [replyTo, setReplyTo]       = useState<Comment | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [sendError, setSendError]   = useState<string | null>(null);
    const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
    
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { theme } = useTheme();
    const isDark = theme !== "light";

    async function fetchComments() {
        try {
            setLoading(true);
            const data = await interactionFacade.getComments(postId);
            setComments(Array.isArray(data) ? data : []);
        } catch {
            setComments([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchComments(); }, [postId]);

    async function handleSubmit() {
        if (!text.trim() || submitting) return;
        setSubmitting(true); setSendError(null);
        try {
            await interactionFacade.addComment({
                post_id: postId,
                content: text.trim(),
                parent_id: replyTo?.id
            });
            setText(""); setReplyTo(null);
            await fetchComments();
        } catch (e: any) {
            setSendError(e.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleReportSubmit() {
        if (!reportingCommentId) return;
        try {
            await interactionFacade.reportContent("comment", reportingCommentId);
            await fetchComments();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setReportingCommentId(null);
        }
    }

    const roots = comments.filter(c => !c.parent_id);
    const repliesOf = (id: string) => comments.filter(c => c.parent_id === id);

    return (
        <div dir="rtl" className="flex flex-col h-full relative" style={{ color: "var(--text-primary)" }}>
            {!hideHeader && (
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border-soft)" }}>
                    <span className="font-bold text-base">نظرات ({comments.length})</span>
                    <button onClick={onClose} className="text-xl opacity-60 hover:opacity-100">✕</button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loading ? <div className="flex justify-center py-10 animate-spin">...</div> : 
                 roots.map(root => (
                    <div key={root.id} className="space-y-2">
                        <CommentBubble comment={root} onReply={c => { setReplyTo(c); setTimeout(() => inputRef.current?.focus(), 50); }} isDark={isDark} onReportClick={setReportingCommentId} />
                        {repliesOf(root.id).map(reply => (
                            <div key={reply.id} className="mr-6 pr-3 border-r-2 border-blue-500/20">
                                <CommentBubble comment={reply} onReply={c => { setReplyTo(c); setTimeout(() => inputRef.current?.focus(), 50); }} isDark={isDark} onReportClick={setReportingCommentId} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="px-4 pb-5 pt-3 border-t shrink-0" style={{ borderColor: "var(--border-soft)" }}>
                {replyTo && (
                    <div className="flex items-center justify-between rounded-xl px-3 py-2 mb-2 bg-blue-500/10 border-r-4 border-blue-500 text-xs">
                        <span className="truncate">پاسخ به {replyTo.publisher_username}</span>
                        <button onClick={() => setReplyTo(null)}>✕</button>
                    </div>
                )}
                {sendError && <p className="text-[10px] text-red-400 mb-1">{sendError}</p>}
                <div className="flex gap-2 items-end">
                    <textarea ref={inputRef} rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="نظرتان را بنویسید..." className="flex-1 bg-transparent border rounded-xl p-2 text-sm outline-none" style={{ borderColor: "var(--border-soft)" }} />
                    <button onClick={handleSubmit} disabled={submitting || !text.trim()} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">→</button>
                </div>
            </div>
            {reportingCommentId && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl text-center shadow-2xl w-[80%] max-w-[300px]">
                        <AlertTriangle className="mx-auto text-red-500 mb-4" />
                        <p className="text-sm mb-6">آیا از گزارش این کامنت اطمینان دارید؟</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={handleReportSubmit} className="w-full py-2 bg-red-500 text-white rounded-xl">بله</button>
                            <button onClick={() => setReportingCommentId(null)} className="w-full py-2 bg-slate-200 dark:bg-slate-700 rounded-xl">خیر</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CommentBubble({ comment, onReply, isDark, onReportClick }: any) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="relative group p-3 rounded-2xl bg-slate-400/5 border border-transparent hover:border-slate-400/10">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold opacity-70">{comment.publisher_username}</span>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 opacity-0 group-hover:opacity-100"><MoreVertical size={14}/></button>
                    {menuOpen && (
                        <div className="absolute left-0 top-6 bg-white dark:bg-slate-700 shadow-2xl rounded-lg overflow-hidden z-20 text-[11px] min-w-[90px] border border-black/5">
                            <button onClick={() => {onReply(comment); setMenuOpen(false);}} className="w-full p-2.5 text-right hover:bg-blue-500/10 text-blue-500">ریپلای</button>
                            <button onClick={() => {onReportClick(comment.id); setMenuOpen(false);}} className="w-full p-2.5 text-right hover:bg-red-500/10 text-red-500">ریپورت</button>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-sm leading-6">{comment.content}</p>
        </div>
    );
}
import { useState, useEffect } from "react";
import { cn } from "../../../Infrastructure/Utility/cn";
import { useTheme } from "../../../Infrastructure/Contexts/ThemeContext";
import { MoreVertical, ShieldAlert, X, AlertTriangle } from "lucide-react";
import { interactionFacade } from "../../../Infrastructure/Utility/interactionFacade";

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

export function CommentSection({ postId, onClose }: Props) {
    const { theme } = useTheme();
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await interactionFacade.getComments(postId);
                setComments(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchComments();
    }, [postId]);

    async function handleSubmit() {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        try {
            setLoading(true);
            const result = await interactionFacade.addComment({
                post_id: postId,
                content: trimmed
            });

            const newComment: Comment = {
                id: result.id || Date.now().toString(),
                username: localStorage.getItem("username") || "کاربر",
                text: trimmed,
                createdAt: "لحظاتی پیش",
            };

            setComments((prev) => [...prev, newComment]);
            setText("");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleReportSubmit = async () => {
        if (!reportingCommentId) return;
        try {
            await interactionFacade.reportContent("comment", reportingCommentId);
            alert("گزارش با موفقیت ثبت شد");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setReportingCommentId(null);
            setActiveMenu(null);
        }
    };

    return (
        <div dir="rtl" className="flex flex-col h-full w-full relative overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-transparent shrink-0">
                <span className="text-[16px] font-bold text-slate-700 dark:text-slate-100">
                    کامنت‌ها
                </span>
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <X className="w-5 h-5 opacity-50" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                {comments.length === 0 ? (
                    <div className="text-center text-[13px] pt-10 opacity-30">هنوز کامنتی ثبت نشده</div>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} className="group relative flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-200 dark:bg-white/5 text-slate-400 border border-black/5 dark:border-white/5">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                                    <path d="M20 20a8 8 0 1 0-16 0" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold dark:text-white">{c.username}</span>
                                    <div className="relative">
                                        <button 
                                            onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)}
                                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4 opacity-40" />
                                        </button>
                                        {activeMenu === c.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                <div className="absolute left-0 top-full mt-1 w-28 z-20 overflow-hidden rounded-xl bg-white dark:bg-[#1c2237] border border-black/10 dark:border-white/10 shadow-xl animate-in fade-in zoom-in-95">
                                                    <button 
                                                        onClick={() => setReportingCommentId(c.id)}
                                                        className="flex items-center gap-2 w-full px-4 py-3 text-[12px] hover:bg-red-500/10 text-red-500 transition-colors font-bold"
                                                    >
                                                        <ShieldAlert className="w-4 h-4" /> ریپورت
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="mt-1.5 text-[13px] leading-6 opacity-80 dark:text-slate-300">{c.text}</p>
                                <span className="mt-2 block text-[10px] opacity-40 italic font-medium">{c.createdAt}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="px-6 py-6 border-t border-white/5 shrink-0">
                <div className="flex items-end gap-3 bg-black/5 dark:bg-white/5 p-2 rounded-[20px] border border-black/5 dark:border-white/10 focus-within:border-blue-500/50 transition-all">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="کامنت بنویس..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent px-3 py-2 text-[13px] outline-none placeholder:opacity-30 dark:text-white"
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                    />
                    <button
                        disabled={!text.trim() || loading}
                        onClick={handleSubmit}
                        className="h-10 px-6 rounded-full bg-blue-600 text-white text-[12px] font-bold transition-all hover:bg-blue-700 disabled:opacity-30"
                    >
                        {loading ? "..." : "ارسال"}
                    </button>
                </div>
            </div>

            {reportingCommentId && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReportingCommentId(null)} />
                    <div className={cn(
                        "relative w-full max-w-[290px] rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border text-center animate-in zoom-in-95 duration-200",
                        "bg-white border-slate-100 dark:bg-[#1c2237] dark:border-white/10"
                    )}>
                        <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <AlertTriangle className="text-red-500 w-8 h-8" />
                        </div>
                        <h3 className="text-[17px] font-extrabold mb-3 text-slate-800 dark:text-white">گزارش تخلف</h3>
                        <p className="text-[13px] leading-6 mb-8 text-slate-500 dark:text-slate-400 font-medium">آیا از گزارش این کامنت اطمینان دارید؟</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleReportSubmit} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-[14px] font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20">بله، مطمئنم</button>
                            <button onClick={() => setReportingCommentId(null)} className="w-full py-4 rounded-2xl text-[14px] font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10">انصراف</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
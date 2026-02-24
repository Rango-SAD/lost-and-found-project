import { useEffect, useRef, useState } from "react";
import { CommentSection } from "../CommentSection";

interface Props {
    postId:  string;
    onClose: () => void;
    theme:   string;
}

export function MobileBottomSheet({ postId, onClose, theme }: Props) {
    const [visible, setVisible]   = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragY, setDragY]       = useState(0);
    const startYRef               = useRef(0);
    const isDark                  = theme !== "light";

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        document.body.classList.add("sheet-open");
        return () => { document.body.classList.remove("sheet-open"); };
    }, []);

    function close() {
        setVisible(false);
        setTimeout(onClose, 320);
    }

    function onTouchStart(e: React.TouchEvent) {
        startYRef.current = e.touches[0].clientY;
        setDragging(true);
    }
    function onTouchMove(e: React.TouchEvent) {
        const delta = e.touches[0].clientY - startYRef.current;
        if (delta > 0) setDragY(delta);
    }
    function onTouchEnd() {
        setDragging(false);
        if (dragY > 120) close();
        else setDragY(0);
    }

    return (
        <div className="lg:hidden fixed inset-0 z-[200]">
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", opacity: visible ? 1 : 0 }}
                onClick={close}
            />
            <div
                className="absolute bottom-0 left-0 right-0 flex flex-col"
                style={{
                    height:        "88vh",
                    borderRadius:  "24px 24px 0 0",
                    background:    isDark ? "rgba(12,16,32,0.98)" : "rgba(248,250,253,0.98)",
                    backdropFilter:"blur(40px)",
                    border:        "1px solid var(--border-soft)",
                    borderBottom:  "none",
                    boxShadow:     "0 -8px 40px rgba(0,0,0,0.3)",
                    transform:     `translateY(${visible ? dragY : "100%"}px)`,
                    transition:    dragging ? "none" : "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
                    willChange:    "transform",
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full" style={{ background: "var(--border-medium)" }} />
                </div>

                <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b"
                    style={{ borderColor: "var(--border-soft)" }}>
                    <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>نظرات</span>
                    <button onClick={close}
                        className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <CommentSection postId={postId} onClose={close} hideHeader />
                </div>
            </div>
        </div>
    );
}
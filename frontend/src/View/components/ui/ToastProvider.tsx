import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "../../../Infrastructure/Utility/cn";

type ToastItem = {
    id: string;
    message: string;
};

type ToastApi = {
    push: (message: string) => void;
    dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setItems((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (message: string) => {
            const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            setItems((prev) => [...prev, { id, message }]);

            // Auto dismiss after 10 seconds
            window.setTimeout(() => dismiss(id), 10_000);
        },
        [dismiss]
    );

    const api = useMemo(() => ({ push, dismiss }), [push, dismiss]);

    return (
        <ToastContext.Provider value={api}>
            {children}

            {/* Toast container (lower-left) */}
            <div className="pointer-events-none fixed bottom-6 left-6 z-[9999] flex w-[min(360px,92vw)] flex-col gap-3">
                {items.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => dismiss(t.id)}
                        className={cn(
                            "pointer-events-auto text-right",
                            "rounded-[18px] px-4 py-3",
                            "bg-white/10 backdrop-blur-2xl",
                            "border border-[rgba(160,177,225,0.14)]",
                            "ring-1 ring-white/10",
                            "shadow-[0_18px_60px_rgba(0,0,0,0.45),0_0_28px_rgba(232,236,255,0.18)]",

                            // SLIDE-IN animation
                            "transform transition-all duration-500 ease-out",
                            "translate-x-0 opacity-100",
                            "animate-toast-in",

                            // hover
                            "hover:bg-white/14"
                        )}

                        aria-label="dismiss toast"
                    >
                        <div className="text-[13px] font-semibold text-[#e8ecff]">{t.message}</div>
                        <div className="mt-1 text-[12px] text-[#aab0d6]">برای بستن کلیک کنید</div>
                    </button>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside <ToastProvider>");
    }
    return ctx;
}

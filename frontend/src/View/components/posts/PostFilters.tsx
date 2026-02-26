import { useState } from "react";
import { useTheme } from "../../../Infrastructure/Contexts/ThemeContext";
import { cn } from "../../../Infrastructure/Utility/cn";

interface PostFiltersProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
}

const CATEGORIES = [
    { value: "All", label: "همه دسته‌بندی‌ها" },
    { value: "Electronics", label: "الکترونیکی" },
    { value: "Documents", label: "مدارک" },
    { value: "Keys", label: "کلید" },
    { value: "Clothing", label: "پوشاک" },
    { value: "Books", label: "کتاب" },
    { value: "Other", label: "سایر" },
];

export function PostFilters({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
}: PostFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();

    const selectedLabel =
        CATEGORIES.find((c) => c.value === selectedCategory)?.label ?? "همه";

    return (
        <div
            dir="rtl"
            className="w-full max-w-7xl mx-auto mb-10 flex flex-wrap items-center gap-3 px-2"
        >
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((p) => !p)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[13px] font-semibold transition-all border min-w-[170px] justify-between",
                        "bg-black/5 border-black/10 text-slate-700 hover:bg-black/10",
                        "dark:bg-white/5 dark:border-white/20 dark:text-[#e8ecff] dark:hover:border-white/30 dark:hover:bg-white/8"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-400 dark:text-[#6f76a8]">
                            <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>{selectedLabel}</span>
                    </div>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={cn("transition-transform opacity-50", isOpen ? "rotate-180" : "")}
                    >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className={cn(
                            "absolute top-full mt-2 right-0 z-20 min-w-[200px] rounded-[18px] overflow-hidden border shadow-xl animate-in fade-in zoom-in-95 duration-150",
                            "bg-white border-slate-200",
                            "dark:bg-[#0f1324]/95 dark:backdrop-blur-xl dark:border-white/20"
                        )}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(cat.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-right px-4 py-3 text-[13px] transition-colors",
                                        selectedCategory === cat.value
                                            ? "text-blue-500 bg-blue-500/5 dark:bg-blue-500/10 font-bold"
                                            : "text-slate-600 dark:text-[#aab0d6] hover:bg-slate-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="relative flex-1 max-w-sm group">
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#6f76a8] group-focus-within:text-blue-500 transition-colors pointer-events-none"
                >
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    placeholder="جستجو در پست‌ها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                        "w-full pr-10 pl-4 py-2.5 rounded-[14px] text-[13px] border outline-none transition-all",
                        "bg-black/5 border-black/10 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 shadow-sm",
                        "dark:bg-white/5 dark:border-white/20 dark:text-[#e8ecff] dark:placeholder:text-[#6f76a8] dark:focus:border-white/40 dark:focus:bg-white/8"
                    )}
                />
            </div>
        </div>
    );
}
import { useState } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";

interface PostFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}

const CATEGORIES = ["All", "Electronics", "Documents", "Keys", "Clothing", "Books", "Other"];

export function PostFilters({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: PostFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto mb-10 flex flex-wrap items-center justify-start gap-3 px-2" dir="rtl">
      
      <div className="relative w-48">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-2.5 rounded-xl backdrop-blur-md transition-all border
            /* استایل بر اساس لایت/دارک مود */
            bg-white/5 dark:bg-white/5 
            border-slate-300 dark:border-white/10 
            hover:border-blue-400 dark:hover:border-blue-500/50
            text-slate-700 dark:text-slate-200
          `}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-semibold">
                {selectedCategory === "All" ? "همه دسته‌ها" : selectedCategory}
            </span>
          </div>
          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
            <div className={`
              absolute top-full mt-2 w-full z-20 overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 border
              bg-white/95 dark:bg-[#0f172a]/95 
              border-slate-200 dark:border-white/10
            `}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                  className={`
                    w-full text-right px-4 py-2.5 text-xs transition-colors
                    ${selectedCategory === cat 
                      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 font-bold" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"}
                  `}
                >
                  {cat === "All" ? "همه دسته‌بندی‌ها" : cat}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative w-full max-w-xs group">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-all" />
        <input
          type="text"
          placeholder="جستجو..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`
            w-full pr-10 pl-4 py-2.5 rounded-xl backdrop-blur-md outline-none transition-all text-xs border
            bg-white/5 dark:bg-white/5
            border-slate-300 dark:border-white/10
            focus:border-blue-500/50 dark:focus:border-blue-500/40
            text-slate-800 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
          `}
        />
      </div>

    </div>
  );
}
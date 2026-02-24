import type { FilterState } from "./postsTypes";

type Props = {
    filters:       FilterState;
    onChange:      (f: Partial<FilterState>) => void;
    totalCount:    number;
    filteredCount: number;
    isDark:        boolean;
};

const inputStyle = (isDark: boolean, active?: boolean) => ({
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border:     `1px solid ${active ? "rgba(99,102,241,0.5)" : "var(--border-soft)"}`,
    color:      active ? "var(--text-primary)" : "var(--text-muted)",
});

export function FilterBar({ filters, onChange, totalCount, filteredCount, isDark }: Props) {
    const { searchText, filterCategory, filterLocation, filterType } = filters;
    const hasFilter = searchText || filterCategory || filterLocation || filterType;

    return (
        <div className="mb-5 flex flex-wrap items-center gap-2">

            <div className="relative flex-[2] min-w-[160px]">
                <input
                    type="text"
                    value={searchText}
                    onChange={e => onChange({ searchText: e.target.value })}
                    placeholder="جستجو..."
                    className="w-full rounded-xl px-4 py-2 pr-9 text-xs outline-none"
                    style={inputStyle(isDark, !!searchText)}
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 shrink-0"
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                {searchText && (
                    <button onClick={() => onChange({ searchText: "" })}
                        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 text-sm leading-none">
                        ✕
                    </button>
                )}
            </div>

            <select
                value={filterType}
                onChange={e => onChange({ filterType: e.target.value as any })}
                className="flex-1 min-w-[100px] rounded-xl px-3 py-2 text-xs outline-none cursor-pointer appearance-none"
                style={inputStyle(isDark, !!filterType)}
            >
                <option value="">گم / پیدا</option>
                <option value="lost">گم‌شده</option>
                <option value="found">پیدا شده</option>
            </select>

            <select
                value={filterCategory}
                onChange={e => onChange({ filterCategory: e.target.value })}
                className="flex-1 min-w-[110px] rounded-xl px-3 py-2 text-xs outline-none cursor-pointer appearance-none"
                style={inputStyle(isDark, !!filterCategory)}
            >
                <option value="">دسته‌بندی</option>
                <option value="Electronics">الکترونیکی</option>
                <option value="Documents">مدارک</option>
                <option value="Wallets / Cards">کیف/کارت</option>
                <option value="Clothing">پوشاک</option>
                <option value="Accessories">اکسسوری</option>
                <option value="Keys">کلید</option>
                <option value="Books">کتاب</option>
                <option value="Other">سایر</option>
            </select>

            <select
                value={filterLocation}
                onChange={e => onChange({ filterLocation: e.target.value })}
                className="flex-1 min-w-[120px] rounded-xl px-3 py-2 text-xs outline-none cursor-pointer appearance-none"
                style={inputStyle(isDark, !!filterLocation)}
            >
                <option value="">مکان</option>
                <option value="دانشکده شیمی">دانشکده شیمی</option>
                <option value="کتابخانه مرکزی">کتابخانه مرکزی</option>
                <option value="تالار ها">تالار ها</option>
                <option value="ابن سینا">ابن سینا</option>
                <option value="سلف">سلف</option>
                <option value="دانشکده کامپیوتر">دانشکده کامپیوتر</option>
                <option value="دانشکده فیزیک">دانشکده فیزیک</option>
                <option value="دانشکده ریاضی">دانشکده ریاضی</option>
                <option value="دانشکده انرژی">دانشکده انرژی</option>
                <option value="دانشکده مکانیک">دانشکده مکانیک</option>
                <option value="ساختمان آموزش">ساختمان آموزش</option>
                <option value="دانشکده علم و مواد">دانشکده علم و مواد</option>
                <option value="دانشکده صنایع">دانشکده صنایع</option>
                <option value="دانشکده شیمی و نفت">دانشکده شیمی و نفت</option>
                <option value="مجتمع خدمات دانش بنیان">مجتمع خدمات دانش بنیان</option>
                <option value="مسجد">مسجد</option>
                <option value="دانشکده هوافضا">دانشکده هوافضا</option>
                <option value="شریف پلاس">شریف پلاس</option>
                <option value="فست فود شریف">فست فود شریف</option>
            </select>

            {hasFilter && (
                <button
                    onClick={() => onChange({ searchText: "", filterCategory: "", filterLocation: "", filterType: "" })}
                    className="px-3 py-2 rounded-xl text-xs transition-all hover:opacity-80 whitespace-nowrap shrink-0"
                    style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e" }}
                >
                    پاک
                </button>
            )}

            {hasFilter && (
                <span className="text-xs opacity-40 whitespace-nowrap shrink-0">
                    {filteredCount}/{totalCount}
                </span>
            )}
        </div>
    );
}
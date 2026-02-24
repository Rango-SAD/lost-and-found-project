import React, { useState, useRef, useEffect } from "react";
import type { FilterState } from "./postsTypes";

type Props = {
    filters:       FilterState;
    onChange:      (f: Partial<FilterState>) => void;
    totalCount:    number;
    filteredCount: number;
    isDark:        boolean;
};

type Option = { value: string; label: string };

function Dropdown({ value, onChange, options, placeholder, isDark, active }: {
    value:       string;
    onChange:    (v: string) => void;
    options:     Option[];
    placeholder: string;
    isDark:      boolean;
    active:      boolean;
}) {
    const [open, setOpen]   = useState(false);
    const ref               = useRef<HTMLDivElement>(null);
    const selected          = options.find(o => o.value === value);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const triggerStyle: React.CSSProperties = {
        background: isDark
            ? active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.05)"
            : active ? "rgba(99,102,241,0.10)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${active
            ? "rgba(99,102,241,0.5)"
            : isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"}`,
        color:    active ? "var(--text-primary)" : "var(--text-muted)",
        transition: "all 0.2s ease",
    };

    const menuStyle: React.CSSProperties = {
        background:    isDark ? "#1a2035" : "#ffffff",
        border:        `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"}`,
        boxShadow:     isDark
            ? "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15)"
            : "0 8px 24px rgba(0,0,0,0.12)",
        borderRadius:  "0.75rem",
        overflow:      "hidden",
        zIndex:        9999,
        maxHeight:     "220px",
        overflowY:     "auto",
        minWidth:      "100%",
        position:      "absolute",
        top:           "calc(100% + 4px)",
        left:          0,
    };

    return (
        <div ref={ref} className="relative flex-1 min-w-[110px]">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs"
                style={triggerStyle}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{ opacity: 0.45, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <path d="m6 9 6 6 6-6"/>
                </svg>
                <span className="truncate mr-1">{selected?.label ?? placeholder}</span>
            </button>

            {open && (
                <div style={menuStyle}>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className="w-full text-right px-4 py-2 text-xs transition-all"
                            style={{
                                color:      opt.value === value
                                    ? (isDark ? "#818cf8" : "#6366f1")
                                    : "var(--text-primary)",
                                background: opt.value === value
                                    ? isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)"
                                    : "transparent",
                                display:    "block",
                            }}
                            onMouseEnter={e => {
                                if (opt.value !== value)
                                    (e.currentTarget as HTMLElement).style.background =
                                        isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
                            }}
                            onMouseLeave={e => {
                                if (opt.value !== value)
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const TYPE_OPTIONS: Option[] = [
    { value: "",      label: "گم / پیدا" },
    { value: "lost",  label: "گم‌شده"   },
    { value: "found", label: "پیدا شده" },
];

const CATEGORY_OPTIONS: Option[] = [
    { value: "",                label: "دسته‌بندی"      },
    { value: "Electronics",     label: "الکترونیکی"     },
    { value: "Documents",       label: "مدارک"           },
    { value: "Wallets / Cards", label: "کیف/کارت"       },
    { value: "Clothing",        label: "پوشاک"           },
    { value: "Accessories",     label: "اکسسوری"        },
    { value: "Keys",            label: "کلید"            },
    { value: "Books",           label: "کتاب"            },
    { value: "Other",           label: "سایر"            },
];

const LOCATION_OPTIONS: Option[] = [
    { value: "",                      label: "مکان"                    },
    { value: "دانشکده شیمی",          label: "دانشکده شیمی"           },
    { value: "کتابخانه مرکزی",        label: "کتابخانه مرکزی"         },
    { value: "تالار ها",              label: "تالار ها"                },
    { value: "ابن سینا",              label: "ابن سینا"                },
    { value: "سلف",                   label: "سلف"                     },
    { value: "دانشکده کامپیوتر",      label: "دانشکده کامپیوتر"       },
    { value: "دانشکده فیزیک",         label: "دانشکده فیزیک"          },
    { value: "دانشکده ریاضی",         label: "دانشکده ریاضی"          },
    { value: "دانشکده انرژی",         label: "دانشکده انرژی"          },
    { value: "دانشکده مکانیک",        label: "دانشکده مکانیک"         },
    { value: "ساختمان آموزش",         label: "ساختمان آموزش"          },
    { value: "دانشکده علم و مواد",    label: "دانشکده علم و مواد"     },
    { value: "دانشکده صنایع",         label: "دانشکده صنایع"          },
    { value: "دانشکده شیمی و نفت",   label: "دانشکده شیمی و نفت"    },
    { value: "مجتمع خدمات دانش بنیان",label: "مجتمع خدمات دانش بنیان"},
    { value: "مسجد",                  label: "مسجد"                    },
    { value: "دانشکده هوافضا",        label: "دانشکده هوافضا"         },
    { value: "شریف پلاس",             label: "شریف پلاس"               },
    { value: "فست فود شریف",          label: "فست فود شریف"           },
];

export function FilterBar({ filters, onChange, totalCount, filteredCount, isDark }: Props) {
    const { searchText, filterCategory, filterLocation, filterType } = filters;
    const hasFilter = searchText || filterCategory || filterLocation || filterType;

    const inputStyle: React.CSSProperties = {
        background: isDark
            ? searchText ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)"
            : searchText ? "rgba(99,102,241,0.08)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${searchText
            ? "rgba(99,102,241,0.5)"
            : isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"}`,
        color:      "var(--text-primary)",
        outline:    "none",
        transition: "all 0.2s ease",
    };

    return (
        <div className="mb-5 flex flex-wrap items-center gap-2" dir="rtl">

            <div className="relative flex-[2] min-w-[160px]">
                <input
                    type="text"
                    value={searchText}
                    onChange={e => onChange({ searchText: e.target.value })}
                    placeholder="جستجو..."
                    className="w-full rounded-xl px-4 py-2 pl-9 text-xs"
                    style={inputStyle}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ opacity: 0.35 }}
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                {searchText && (
                    <button onClick={() => onChange({ searchText: "" })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs leading-none"
                        style={{ opacity: 0.5 }}>✕</button>
                )}
            </div>

            <Dropdown
                value={filterType}
                onChange={v => onChange({ filterType: v as any })}
                options={TYPE_OPTIONS}
                placeholder="گم / پیدا"
                isDark={isDark}
                active={!!filterType}
            />

            <Dropdown
                value={filterCategory}
                onChange={v => onChange({ filterCategory: v })}
                options={CATEGORY_OPTIONS}
                placeholder="دسته‌بندی"
                isDark={isDark}
                active={!!filterCategory}
            />

            <Dropdown
                value={filterLocation}
                onChange={v => onChange({ filterLocation: v })}
                options={LOCATION_OPTIONS}
                placeholder="مکان"
                isDark={isDark}
                active={!!filterLocation}
            />

            {hasFilter && (
                <button
                    onClick={() => onChange({ searchText: "", filterCategory: "", filterLocation: "", filterType: "" })}
                    className="px-3 py-2 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all"
                    style={{ background: "rgba(244,63,94,0.10)", border: "1px solid rgba(244,63,94,0.25)", color: "#f43f5e" }}
                >
                    پاک
                </button>
            )}

            {hasFilter && (
                <span className="text-xs whitespace-nowrap shrink-0" style={{ opacity: 0.4 }}>
                    {filteredCount}/{totalCount}
                </span>
            )}
        </div>
    );
}
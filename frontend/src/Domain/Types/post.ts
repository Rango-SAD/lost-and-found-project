export type PostType = "LOST" | "FOUND";
export type PostStatus = "Open" | "Resolved";

export type Category =
    | "Electronics"
    | "Documents"
    | "Wallets / Cards"
    | "Clothing"
    | "Accessories"
    | "Keys"
    | "Books"
    | "Other";

export const CATEGORY_LABEL_FA: Record<Category, string> = {
    Electronics: "الکترونیکی",
    Documents: "مدارک",
    "Wallets / Cards": "کیف پول / کارت‌ها",
    Clothing: "پوشاک",
    Accessories: "اکسسوری",
    Keys: "کلید",
    Books: "کتاب",
    Other: "سایر",
};

export type CategoryTheme = {
    pillBg: string;
    pillText: string;
    glow: string;
};

export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
    Electronics: {
        pillBg: "bg-neon-cyan/10",
        pillText: "text-neon-cyan",
        glow: "shadow-[0_0_18px_rgba(0,245,255,0.25)]",
    },
    Documents: {
        pillBg: "bg-neon-blue/10",
        pillText: "text-neon-blue",
        glow: "shadow-[0_0_18px_rgba(77,124,255,0.25)]",
    },
    "Wallets / Cards": {
        pillBg: "bg-neon-green/10",
        pillText: "text-neon-green",
        glow: "shadow-[0_0_18px_rgba(57,255,136,0.25)]",
    },
    Clothing: {
        pillBg: "bg-neon-pink/10",
        pillText: "text-neon-pink",
        glow: "shadow-[0_0_18px_rgba(255,79,216,0.25)]",
    },
    Accessories: {
        pillBg: "bg-neon-purple/10",
        pillText: "text-neon-purple",
        glow: "shadow-[0_0_18px_rgba(155,92,255,0.25)]",
    },
    Keys: {
        pillBg: "bg-neon-yellow/10",
        pillText: "text-neon-yellow",
        glow: "shadow-[0_0_18px_rgba(255,227,71,0.22)]",
    },
    Books: {
        pillBg: "bg-neon-orange/10",
        pillText: "text-neon-orange",
        glow: "shadow-[0_0_18px_rgba(255,159,67,0.22)]",
    },
    Other: {
        pillBg: "bg-neon-red/10",
        pillText: "text-neon-red",
        glow: "shadow-[0_0_18px_rgba(255,92,92,0.22)]",
    },
};

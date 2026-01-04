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

export type CategoryTheme = {
    pillBg: string;
    pillText: string;
    glow: string;
};

export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
    Electronics: {
        pillBg: "bg-[rgba(0,245,255,0.15)]",
        pillText: "text-[#00f5ff]",
        glow: "shadow-[0_0_18px_rgba(0,245,255,0.22)]",
    },
    Documents: {
        pillBg: "bg-[rgba(77,124,255,0.15)]",
        pillText: "text-[#4d7cff]",
        glow: "shadow-[0_0_18px_rgba(77,124,255,0.22)]",
    },
    "Wallets / Cards": {
        pillBg: "bg-[rgba(57,255,136,0.15)]",
        pillText: "text-[#39ff88]",
        glow: "shadow-[0_0_18px_rgba(57,255,136,0.22)]",
    },
    Clothing: {
        pillBg: "bg-[rgba(255,79,216,0.15)]",
        pillText: "text-[#ff4fd8]",
        glow: "shadow-[0_0_18px_rgba(255,79,216,0.22)]",
    },
    Accessories: {
        pillBg: "bg-[rgba(155,92,255,0.15)]",
        pillText: "text-[#9b5cff]",
        glow: "shadow-[0_0_18px_rgba(155,92,255,0.22)]",
    },
    Keys: {
        pillBg: "bg-[rgba(255,227,71,0.15)]",
        pillText: "text-[#ffe347]",
        glow: "shadow-[0_0_18px_rgba(255,227,71,0.22)]",
    },
    Books: {
        pillBg: "bg-[rgba(255,159,67,0.15)]",
        pillText: "text-[#ff9f43]",
        glow: "shadow-[0_0_18px_rgba(255,159,67,0.22)]",
    },
    Other: {
        pillBg: "bg-[rgba(255,92,92,0.15)]",
        pillText: "text-[#ff5c5c]",
        glow: "shadow-[0_0_18px_rgba(255,92,92,0.22)]",
    },
};

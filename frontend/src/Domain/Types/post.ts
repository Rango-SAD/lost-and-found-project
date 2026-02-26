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

export const CATEGORY_FA: Record<Category, string> = {
    Electronics: "الکترونیکی",
    Documents: "مدارک",
    "Wallets / Cards": "کیف پول/کارت",
    Clothing: "پوشاک",
    Accessories: "لوازم جانبی",
    Keys: "کلید",
    Books: "کتاب",
    Other: "سایر",
};

export const CATEGORY_COLOR: Record<Category, string> = {
    Electronics: "#00f5ff",
    Documents: "#4d7cff",
    "Wallets / Cards": "#39ff88",
    Clothing: "#ff4fd8",
    Accessories: "#9b5cff",
    Keys: "#ffe347",
    Books: "#ff9f43",
    Other: "#ff5c5c",
};

import type { LostFoundPost } from '../../Domain/Entities/LostFoundPost';

export interface RawItem {
    id: string;
    status: string;
    location: { lat: number; lng: number };
    itemName: string;
    title?: string;
    category: string;
    categoryName?: string;
    category_key?: string;
    tag: string;
    description: string;
    publisher_username?: string;
    publisherName?: string;
    image_url?: string;
    date?: string;
    created_at?: string;
    timestamp?: string;
    [key: string]: any;
}

export interface MapCluster {
    lat: number;
    lng: number;
    lostCount: number;
    foundCount: number;
    items: RawItem[];
}


function mapCategory(raw: string): LostFoundPost["category"] {
    const c = (raw || "").toLowerCase();
    if (c === "electronics") return "Electronics" as LostFoundPost["category"];
    if (c === "documents")   return "Documents"   as LostFoundPost["category"];
    if (c === "keys")        return "Keys"         as LostFoundPost["category"];
    if (c === "clothing")    return "Clothing"     as LostFoundPost["category"];
    if (c === "books")       return "Books"        as LostFoundPost["category"];
    return "Other" as LostFoundPost["category"];
}

export function mapRawItemToPost(item: RawItem): LostFoundPost {
    const type: LostFoundPost["type"] = item.status?.includes("گم") ? "LOST" : "FOUND";
    
    let publishedAt = "";
    if (item.created_at) {
        try {
            const date = new Date(item.created_at);
            publishedAt = date.toLocaleDateString("fa-IR");
        } catch {
            publishedAt = "";
        }
    } else if (item.date) {
        publishedAt = item.date;
    } else if (item.timestamp) {
        try {
            publishedAt = new Date(item.timestamp).toLocaleDateString("fa-IR");
        } catch {
            publishedAt = "";
        }
    }
    
    return {
        id:            item.id,
        type,
        status:        "Open",
        category:      mapCategory(item.category_key || item.category),
        itemName:      item.title || item.itemName,
        tag:           item.tag,
        location:      item.location ? `${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}` : "—",
        description:   item.description,
        publisherName: item.publisher_username || item.publisherName || "نام کاربری",
        publishedAt:   publishedAt || "—",
        imageUrl:      item.image_url,
    };
}
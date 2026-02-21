import type { LostFoundPost } from '../../Domain/Entities/LostFoundPost';

export interface RawItem {
    id: string;
    status: string;
    location: { lat: number; lng: number };
    itemName: string;
    category: string;
    tag: string;
    description: string;
    date?: string;
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
    const publishedAt = item.date
        ?? (item.timestamp ? new Date(item.timestamp).toLocaleString("fa-IR") : "");
    return {
        id:            item.id,
        type,
        status:        "Open",
        category:      mapCategory(item.category),
        itemName:      item.itemName,
        tag:           item.tag,
        location:      item.location ? `${item.location.lat}, ${item.location.lng}` : "—",
        description:   item.description,
        publisherName: "نام کاربری",
        publishedAt,
    };
}
import type { LostFoundPost } from "../../../../Domain/Entities/LostFoundPost";

export type BackendPost = {
    id: string;
    type: "lost" | "found";
    title: string;
    category_key: string;
    tag: string;
    description: string;
    publisher_username: string;
    location: { type: "Point"; coordinates: [number, number] };
    reports_count: number;
    image_url: string | null;
    created_at: string;
};

export type FilterState = {
    searchText:     string;
    filterCategory: string;
    filterLocation: string;
    filterType:     "" | "lost" | "found";
};

export const API_URL = "http://127.0.0.1:8000/posts/all";

export function mapCategory(key: string): LostFoundPost["category"] {
    const map: Record<string, LostFoundPost["category"]> = {
        electronics: "Electronics",
        documents:   "Documents",
        keys:        "Keys",
        clothing:    "Clothing",
        books:       "Books",
        wallets:     "Wallets / Cards",
        accessories: "Accessories",
        other:       "Other",
    };
    return map[key?.toLowerCase()] ?? "Other";
}

export const BUILDINGS = [
    { name: "دانشکده شیمی",          pos: [35.70472076380309,  51.34991451434824] },
    { name: "کتابخانه مرکزی",         pos: [35.70467004563295,  51.35113801588977] },
    { name: "تالار ها",               pos: [35.704343101326025, 51.352110505538995] },
    { name: "ابن سینا",               pos: [35.70402074793266,  51.35222852272552] },
    { name: "سلف",                    pos: [35.703041123576284, 51.35201972022601] },
    { name: "دانشکده کامپیوتر",        pos: [35.7025496004159,  51.35110953004783] },
    { name: "دانشکده فیزیک",           pos: [35.70199306365006, 51.351754222503594] },
    { name: "دانشکده ریاضی",           pos: [35.70397542210906, 51.35034564923419] },
    { name: "دانشکده انرژی",           pos: [35.70536986300352, 51.3512772264833] },
    { name: "دانشکده مکانیک",          pos: [35.706404436949185,51.35085504223541] },
    { name: "ساختمان آموزش",           pos: [35.70547032928061, 51.35066549143685] },
    { name: "دانشکده علم و مواد",       pos: [35.704757302206914,51.35062966851281] },
    { name: "دانشکده صنایع",           pos: [35.70382073617354, 51.35053042678778] },
    { name: "دانشکده شیمی و نفت",      pos: [35.703087811104275,51.35081339988114] },
    { name: "مجتمع خدمات دانش بنیان",  pos: [35.7024196803554,  51.3519949145686] },
    { name: "مسجد",                    pos: [35.70055353067872,  51.351587845001156] },
    { name: "دانشکده هوافضا",          pos: [35.70150875446248, 51.35339839071471] },
    { name: "شریف پلاس",               pos: [35.70324884779711, 51.352424645814985] },
    { name: "فست فود شریف",            pos: [35.70304731762322, 51.35244554705804] },
];

export function nearestBuilding(lng: number, lat: number): string {
    let minDist = Infinity;
    let nearest = "دانشگاه شریف";
    for (const b of BUILDINGS) {
        const d = Math.hypot(b.pos[0] - lat, b.pos[1] - lng);
        if (d < minDist) { minDist = d; nearest = b.name; }
    }
    return nearest;
}

export function mapBackendPost(item: BackendPost): LostFoundPost {
    return {
        id:            item.id,
        type:          item.type === "found" ? "FOUND" : "LOST",
        status:        "Open",
        category:      mapCategory(item.category_key),
        itemName:      item.title,
        tag:           item.tag ?? "",
        location:      item.location
                         ? nearestBuilding(item.location.coordinates[0], item.location.coordinates[1])
                         : "—",
        description:   item.description,
        publisherName: item.publisher_username,
        publishedAt:   new Date(item.created_at).toLocaleString("fa-IR"),
        imageUrl:      item.image_url ?? undefined,
    };
}
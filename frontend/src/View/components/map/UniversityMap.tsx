import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SHARIF_CENTER, OUTER_WORLD, SHARIF_BOUNDARY, BUILDINGS } from './mapData';
import { PostCard } from '../posts/PostCard';
import type { LostFoundPost } from '../../../Domain/Entities/LostFoundPost';
import { useTheme } from '../../../ThemeContex';

function mapCategory(dbCategory: string): LostFoundPost["category"] {
    const c = (dbCategory || "").toLowerCase();
    if (c === "electronics") return "Electronics" as LostFoundPost["category"];
    if (c === "documents")   return "Documents"   as LostFoundPost["category"];
    if (c === "keys")        return "Keys"         as LostFoundPost["category"];
    if (c === "clothing")    return "Clothing"     as LostFoundPost["category"];
    if (c === "books")       return "Books"        as LostFoundPost["category"];
    return "Other" as LostFoundPost["category"];
}

function mapDbItemToPost(item: any): LostFoundPost {
    const type: LostFoundPost["type"] = item.status?.includes("گم") ? "LOST" : "FOUND";
    const publishedAt = item.date ?? (item.timestamp ? new Date(item.timestamp).toLocaleString("fa-IR") : "");
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


const makePin = (color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
        <path d="M12 1C6.477 1 2 5.477 2 11c0 7 10 20 10 20s10-13 10-20c0-5.523-4.477-10-10-10z"
            fill="${color}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <circle cx="12" cy="11" r="4" fill="rgba(255,255,255,0.85)"/>
    </svg>`;
    return new L.Icon({
        iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
        iconSize: [24, 32], iconAnchor: [12, 32], popupAnchor: [0, -34],
    });
};

const lostIcon  = makePin('#f43f5e');
const foundIcon = makePin('#10b981');
const emptyIcon = new L.Icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    iconSize: [1, 1],
});


interface Props {
    selectable?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
    showExistingItems?: boolean;
}

const UniversityMap: React.FC<Props> = ({ selectable, onLocationSelect, showExistingItems }) => {
    const [items, setItems] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<LostFoundPost | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (showExistingItems) {
            fetch('http://localhost:3001/lostAndFoundItems')
                .then(res => res.json())
                .then(data => setItems(data))
                .catch(err => console.error("Error fetching items:", err));
        }
    }, [showExistingItems]);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                if (selectable && onLocationSelect)
                    onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <>
            <MapContainer
                center={SHARIF_CENTER as [number, number]}
                zoom={17}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
            >
                <TileLayer
                        url={
                                  theme === "light"
                                  ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                   : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            }
                />
                <MapEvents />

               <Polygon
                    positions={[OUTER_WORLD as any, SHARIF_BOUNDARY as any]}
                    pathOptions={{
                    fillColor: theme === "light" ? "#DDE4EE" : "#020617",
                    fillOpacity: 0.9,
                    weight: 0
                      }}
                />
                <Polygon
                    positions={SHARIF_BOUNDARY as any}
                    pathOptions={{ color: '#3b82f6', fillColor: 'transparent', weight: 2.5 }}
                />

                {BUILDINGS.map((building, index) => (
                    <Marker key={`building-${index}`} position={building.pos as [number, number]} icon={emptyIcon}>
                        <Tooltip permanent direction="center" className="neon-label">{building.name}</Tooltip>
                    </Marker>
                ))}

                {showExistingItems && items.map((item) => (
                    item.location && (
                        <Marker
                            key={item.id}
                            position={[item.location.lat, item.location.lng]}
                            icon={item.status === 'گم شده' ? lostIcon : foundIcon}
                            eventHandlers={{ click: () => setSelectedPost(mapDbItemToPost(item)) }}
                        >
                            <Tooltip>{item.itemName} ({item.status})</Tooltip>
                        </Marker>
                    )
                ))}
            </MapContainer>

           
            {selectedPost && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    onClick={() => setSelectedPost(null)}
                >
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
                    <div onClick={(e) => e.stopPropagation()}>
                        <PostCard
                            post={selectedPost}
                            onContact={(id, msg) => console.log("contact", id, msg)}
                            onReport={(id) => console.log("report", id)}
                            onOpen={() => setSelectedPost(null)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default UniversityMap;
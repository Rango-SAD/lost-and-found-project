import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SHARIF_CENTER, OUTER_WORLD, SHARIF_BOUNDARY, BUILDINGS } from './mapData';
import { PostCard } from '../posts/PostCard';
import { useTheme } from '../../../Infrastructure/Contexts/ThemeContext';
import { useMapItems } from '../../handlers/useMapItems';
import { clusterItems, pinSizeFromZoom, labelFontFromZoom } from './mapUtils';
import { makeClusterIcon, makeLabelIcon } from './mapIcons';
import { mapRawItemToPost, type MapProps } from '../../../Domain/Types/mapTypes';


function ZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
    const map = useMap();
    useEffect(() => {
        const handler = () => onZoomChange(map.getZoom());
        handler();
        map.on('zoomend', handler);
        return () => { map.off('zoomend', handler); };
    }, [map, onZoomChange]);
    return null;
}

function MapClickHandler({ selectable, onLocationSelect }: {
    selectable?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            if (selectable && onLocationSelect) onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function FlyToLocation({ coords }: { coords: { lat: number; lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], 18, { animate: true, duration: 1.2 });
        }
    }, [coords, map]);
    return null;
}


const UniversityMap: React.FC<MapProps> = ({ selectable, onLocationSelect, showExistingItems }) => {
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [zoom, setZoom]                     = useState(16);
    const [flyTarget, setFlyTarget]           = useState<{ lat: number; lng: number } | null>(null);
    const { theme }                           = useTheme();

    const { items } = useMapItems(!!showExistingItems);

    const handleZoom    = useCallback((z: number) => setZoom(z), []);

    const clusters = useMemo(
        () => clusterItems(items.filter(i => i.location), zoom),
        [items, zoom]
    );

    const pinSize   = pinSizeFromZoom(zoom);
    const labelFont = labelFontFromZoom(zoom);
    const outerFill = theme === 'light' ? '#DDE4EE' : '#020617';
    const tileUrl   = theme === 'light'
        ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    const selectedPost = useMemo(() => {
        if (!selectedPostId) return null;
        const found = items.find(i => i.id === selectedPostId);
        return found ? mapRawItemToPost(found) : null;
    }, [selectedPostId, items]);

    const handleMyLocation = useCallback(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => setFlyTarget({ lat: coords.latitude, lng: coords.longitude }),
            (err) => console.warn("Geolocation error:", err.message)
        );
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MapContainer
                center={SHARIF_CENTER as [number, number]}
                zoom={16}
                minZoom={14}
                maxZoom={19}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
            >
                <TileLayer url={tileUrl} maxNativeZoom={18} maxZoom={19} />
                <MapClickHandler selectable={selectable} onLocationSelect={onLocationSelect} />
                <ZoomWatcher onZoomChange={handleZoom} />
                <FlyToLocation coords={flyTarget} />

                <Polygon
                    positions={[OUTER_WORLD as any, SHARIF_BOUNDARY as any]}
                    pathOptions={{ fillColor: outerFill, fillOpacity: 0.9, weight: 0 }}
                />
                <Polygon
                    positions={SHARIF_BOUNDARY as any}
                    pathOptions={{ color: '#3b82f6', fillColor: 'transparent', weight: 2.5 }}
                />

                {BUILDINGS.map((building, index) => (
                    <Marker
                        key={`b-${index}`}
                        position={building.pos as [number, number]}
                        icon={makeLabelIcon(building.name, labelFont, theme)}
                    />
                ))}

                {showExistingItems && clusters.map((cluster, idx) => {
                    const isSingle    = cluster.items.length === 1;
                    const icon        = makeClusterIcon(cluster.lostCount, cluster.foundCount, pinSize);
                    const tooltipText = isSingle
                        ? `${cluster.items[0].itemName} (${cluster.items[0].status})`
                        : `${cluster.items.length} مورد · ${cluster.lostCount} گم‌شده · ${cluster.foundCount} پیدا‌شده`;

                    return (
                        <Marker
                            key={`c-${idx}`}
                            position={[cluster.lat, cluster.lng]}
                            icon={icon}
                            eventHandlers={{
                                click: () => setSelectedPostId(cluster.items[0].id)
                            }}
                        >
                            {pinSize >= 22 && (
                                <Tooltip
                                    direction="top"
                                    offset={[0, -(Math.round(pinSize * (isSingle ? 0.7 : 1) * 1.33) + 4)]}
                                    opacity={0.92}
                                >
                                    {tooltipText}
                                </Tooltip>
                            )}
                        </Marker>
                    );
                })}
            </MapContainer>

            <button
                onClick={handleMyLocation}
                title="موقعیت فعلی من"
                style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: theme === 'light' ? '#1e3270' : '#aab0d6',
                    fontSize: 12,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    direction: 'rtl',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3"/>
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                </svg>
                مکان فعلی من
            </button>

            {selectedPost && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    onClick={() => setSelectedPostId(null)}
                >
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
                    <div onClick={e => e.stopPropagation()}>
                        <PostCard
                            post={selectedPost}
                            onContact={(id, msg) => console.log("contact", id, msg)}
                            onReport={(id) => console.log("report", id)}
                            onOpen={() => setSelectedPostId(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityMap;
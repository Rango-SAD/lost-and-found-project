import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SHARIF_CENTER, OUTER_WORLD, SHARIF_BOUNDARY, BUILDINGS } from './mapData';
import { PostCard } from '../posts/PostCard';
import { useTheme } from '../../../Infrastructure/Contexts/ThemeContext';
import { useMapItems } from '../../handlers/useMapItems';
import { clusterItems, pinSizeFromZoom, labelFontFromZoom } from './mapUtils';
import { makeClusterIcon, makeLabelIcon } from './mapIcons';
import { mapRawItemToPost, type MapProps, type MapCluster } from '../../../Domain/Types/mapTypes';

const getNearestBuildingName = (lat: number, lng: number) => {
    if (!BUILDINGS || BUILDINGS.length === 0) return "مکان نامشخص";
    
    let nearest = BUILDINGS[0];
    let minDistance = Math.pow(lat - BUILDINGS[0].pos[0], 2) + Math.pow(lng - BUILDINGS[0].pos[1], 2);

    BUILDINGS.forEach((building) => {
        const dist = Math.pow(lat - building.pos[0], 2) + Math.pow(lng - building.pos[1], 2);
        if (dist < minDistance) {
            minDistance = dist;
            nearest = building;
        }
    });
    
    return nearest.name;
};

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
    const [selectedCluster, setSelectedCluster] = useState<MapCluster | null>(null);
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
        if (!found) return null;

        const post = mapRawItemToPost(found);
        
        if (found.location) {
            const buildingName = getNearestBuildingName(found.location.lat, found.location.lng);
            (post as any).location = buildingName; 
        }
        
        return post;
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
                    const icon = makeClusterIcon(cluster.lostCount, cluster.foundCount, pinSize);

                    return (
                        <Marker
                            key={`c-${idx}`}
                            position={[cluster.lat, cluster.lng]}
                            icon={icon}
                            eventHandlers={{
                                click: () => {
                                    if (cluster.items.length === 1) {
                                        setSelectedPostId(cluster.items[0].id);
                                    } else {
                                        setSelectedCluster(cluster);
                                    }
                                }
                            }}
                        />
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

            {selectedCluster && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center px-4"
                    onClick={() => setSelectedCluster(null)}
                >
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
                    <div 
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: theme === 'light' ? '#fff' : '#1e293b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '100%',
                            maxHeight: '70vh',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                    >
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            color: theme === 'light' ? '#1e293b' : '#f8fafc',
                            textAlign: 'center'
                        }}>
                            {selectedCluster.items.length} آیتم در این موقعیت
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {selectedCluster.items.map((item) => {
                                const isLost = item.status?.includes("گم");
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedPostId(item.id);
                                            setSelectedCluster(null);
                                        }}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: theme === 'light' ? '#f1f5f9' : '#334155',
                                            cursor: 'pointer',
                                            textAlign: 'right',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: '600' }}>{item.title}</span>
                                            <span style={{
                                                fontSize: '11px',
                                                padding: '2px 8px',
                                                borderRadius: '8px',
                                                background: isLost ? '#ef4444' : '#10b981',
                                                color: 'white'
                                            }}>
                                                {isLost ? 'گم‌شده' : 'پیدا‌شده'}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

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
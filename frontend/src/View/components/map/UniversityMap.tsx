import React, { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SHARIF_CENTER, OUTER_WORLD, SHARIF_BOUNDARY, BUILDINGS } from './mapData';
import { PostCard } from '../posts/PostCard';
import { useTheme } from '../../../ThemeContex';
import { useMapItems } from '../../handlers/useMapItems';
import { clusterItems, pinSizeFromZoom, labelFontFromZoom, makeClusterIcon, makeLabelIcon } from './mapUtils';
import { mapRawItemToPost } from '../../../Domain/Types/mapTypes';


function ZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
    const map = useMap();
    React.useEffect(() => {
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

interface Props {
    selectable?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
    showExistingItems?: boolean;
}

const UniversityMap: React.FC<Props> = ({ selectable, onLocationSelect, showExistingItems = false }) => {
    const [zoom, setZoom]                 = useState(16);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const { theme }                       = useTheme();

    const { items } = useMapItems(showExistingItems);

    const handleZoom = useCallback((z: number) => setZoom(z), []);

    const clusters = useMemo(
        () => clusterItems(items.filter(i => i.location), zoom),
        [items, zoom]
    );

    const pinSize   = pinSizeFromZoom(zoom);
    const labelFont = labelFontFromZoom(zoom);
    const outerFill = theme === 'light' ? '#DDE4EE' : '#020617';
    const selectedPost = useMemo(() => {
        if (!selectedPostId) return null;
        const found = items.find(i => i.id === selectedPostId);
        return found ? mapRawItemToPost(found) : null;
    }, [selectedPostId, items]);

    return (
        <>
            <MapContainer
                center={SHARIF_CENTER as [number, number]}
                zoom={16}
                minZoom={14}
                maxZoom={19}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
            >
                <TileLayer
                    url={
                        theme === 'light'
                            ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    }
                    maxNativeZoom={18}
                    maxZoom={19}
                />
                <MapClickHandler selectable={selectable} onLocationSelect={onLocationSelect} />
                <ZoomWatcher onZoomChange={handleZoom} />

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

                {clusters.map((cluster, idx) => {
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
        </>
    );
};

export default UniversityMap;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniversityMap from "../../components/map/UniversityMap";
import "./MapViewStyle.css";

const MapView = () => {
    const navigate = useNavigate();
    const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedCoords({ lat, lng });
    };

    const confirmSelection = () => {
        if (selectedCoords) {
            navigate("/newItem", { state: { selectedLocation: selectedCoords } });
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center
                        pt-[80px] sm:pt-[100px] pb-20 sm:pb-28 px-3 sm:px-6 overflow-hidden">

            {selectedCoords && (
                <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div
                        className="p-5 sm:p-6 rounded-2xl shadow-2xl text-center w-full max-w-sm"
                        style={{ background: "var(--surface-1)", border: "1px solid var(--border-medium)" }}
                    >
                        <h3 className="mb-3 text-sm sm:text-base font-semibold"
                            style={{ color: "var(--text-primary)" }}>
                            آیا این موقعیت را تایید می‌کنید؟
                        </h3>
                        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                            مختصات: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setSelectedCoords(null)}
                                className="flex-1 px-4 py-2.5 rounded-full text-sm
                                           bg-red-500/20 text-red-400 border border-red-500/50
                                           transition-all hover:bg-red-500/30"
                            >
                                لغو
                            </button>
                            <button
                                onClick={confirmSelection}
                                className="flex-1 px-4 py-2.5 rounded-full text-sm
                                           bg-blue-600 text-white transition-all hover:bg-blue-700"
                            >
                                تایید و ثبت
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="map-wrapper w-full max-w-6xl mb-6 sm:mb-10">
                <UniversityMap
                    selectable={true}
                    onLocationSelect={handleLocationSelect}
                    showExistingItems={true}
                />
            </div>

            <button
                onClick={() => navigate("/newItem")}
                className="fixed left-4 sm:left-8 z-[3000]
                           flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs
                           transition-all hover:opacity-80 active:scale-95"
                style={{
                    bottom:     "calc(72px + 24px)", 
                    background: "var(--surface-2)",
                    border:     "1px solid var(--border-soft)",
                    color:      "var(--text-secondary)",
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                بازگشت به فرم
            </button>
        </div>
    );
};

export default MapView;
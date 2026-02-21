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
        <div className="min-h-screen w-full flex flex-col items-center justify-center pt-[100px] pb-28 overflow-hidden">
            
            
            {selectedCoords && (
                <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="p-6 rounded-2xl shadow-2xl text-center max-w-sm w-[90%]"
                         style={{ background: "var(--surface-1)", border: "1px solid var(--border-medium)" }}>
                        <h3 className="mb-4" style={{ color: "var(--text-primary)" }}>آیا این موقعیت را تایید می‌کنید؟</h3>
                        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                            مختصات: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setSelectedCoords(null)} className="px-6 py-2 rounded-full bg-red-500/20 text-red-400 border border-red-500/50">لغو</button>
                            <button onClick={confirmSelection} className="px-6 py-2 rounded-full bg-blue-600 text-white">تایید و ثبت</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-[0.3em] text-[#e8ecff] drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                   
                </h1>
            </div>

            <div className="map-wrapper w-[90%] max-w-6xl h-[calc(100vh-250px)] mb-10">
                <UniversityMap 
                    selectable={true} 
                    onLocationSelect={handleLocationSelect} 
                    showExistingItems={true} 
                />
            </div>

            <button className="fixed bottom-8 left-8 z-[3000] px-5 py-2 rounded-full text-xs"
                style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-soft)",
                color: "var(--text-secondary)"
                 }}>             
                    ← بازگشت به فرم
            </button>
        </div>
    );
};

export default MapView;
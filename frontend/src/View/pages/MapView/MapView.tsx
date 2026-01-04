import { useNavigate } from "react-router-dom";
import UniversityMap from "../../components/map/UniversityMap";
import "./MapViewStyle.css";

const MapView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-12 pb-32 overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0b0f1a, #12182b, #0f1324)' }}>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-[0.3em] drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            style={{ color: '#e8ecff' }}>
          SHARIF <span className="text-blue-500">MAP</span>
        </h1>
      </div>

      <div className="map-wrapper w-[90%] max-w-6xl h-[calc(100vh-250px)] mb-10">
        <UniversityMap />
      </div>

      <button 
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 z-[3000] bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full hover:text-white transition-all text-xs"
        style={{ color: '#aab0d6' }}
      >
        ← بازگشت به فرم
      </button>
    </div>
  );
};

export default MapView;
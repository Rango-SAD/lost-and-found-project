import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UniversityMap from "../../components/map/UniversityMap";
import "./ItemEntryStyle.css";
import "../MapView/MapViewStyle.css";

const BUILDINGS = [
  { name: "دانشکده شیمی",           pos: [35.70472076380309,  51.34991451434824] },
  { name: "کتابخانه مرکزی",          pos: [35.70467004563295,  51.35113801588977] },
  { name: "تالار ها",                pos: [35.704343101326025, 51.352110505538995] },
  { name: "ابن سینا",                pos: [35.70402074793266,  51.35222852272552] },
  { name: "سلف",                    pos: [35.703041123576284,  51.35201972022601] },
  { name: "دانشکده کامپیوتر",         pos: [35.7025496004159,   51.35110953004783] },
  { name: "دانشکده فیزیک",            pos: [35.70199306365006,  51.351754222503594] },
  { name: "دانشکده ریاضی",            pos: [35.70397542210906,  51.35034564923419] },
  { name: "دانشکده انرژی",            pos: [35.70536986300352,  51.3512772264833] },
  { name: "دانشکده مکانیک",           pos: [35.706404436949185, 51.35085504223541] },
  { name: "ساختمان آموزش",            pos: [35.70547032928061,  51.35066549143685] },
  { name: "دانشکده علم و مواد",        pos: [35.704757302206914, 51.35062966851281] },
  { name: "دانشکده صنایع",            pos: [35.70382073617354,  51.35053042678778] },
  { name: "دانشکده شیمی و نفت",       pos: [35.703087811104275, 51.35081339988114] },
  { name: "مجتمع خدمات دانش بنیان",   pos: [35.7024196803554,   51.3519949145686] },
  { name: "مسجد",                    pos: [35.70055353067872,   51.351587845001156] },
  { name: "دانشکده هوافضا",           pos: [35.70150875446248,  51.35339839071471] },
  { name: "شریف پلاس",               pos: [35.70324884779711,   51.352424645814985] },
  { name: "فست فود شریف",             pos: [35.70304731762322,   51.35244554705804] },
];

function nearestBuilding(lat: number, lng: number): string {
  let minDist = Infinity;
  let nearest = "دانشگاه شریف";
  for (const b of BUILDINGS) {
    const d = Math.hypot(b.pos[0] - lat, b.pos[1] - lng);
    if (d < minDist) { minDist = d; nearest = b.name; }
  }
  return nearest;
}

const SS_KEY = "itemEntryDraft";

function saveDraft(data: object) {
  sessionStorage.setItem(SS_KEY, JSON.stringify(data));
}
function loadDraft() {
  try { return JSON.parse(sessionStorage.getItem(SS_KEY) ?? "null"); }
  catch { return null; }
}
function clearDraft() {
  sessionStorage.removeItem(SS_KEY);
}


function ItemEntryView() {
  const navigate = useNavigate();
  const location = useLocation();

  const draft = loadDraft();

  const [isFound,      setIsFound]      = useState<boolean>(draft?.isFound ?? false);
  const [itemName,     setItemName]     = useState<string>(draft?.itemName ?? "");
  const [tag,          setTag]          = useState<string>(draft?.tag ?? "");
  const [category,     setCategory]     = useState<string>(draft?.category ?? "");
  const [description,  setDescription]  = useState<string>(draft?.description ?? "");
  const [photo,        setPhoto]        = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(draft?.photoPreview ?? "");
  const [showError,    setShowError]    = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPos,  setSelectedPos]  = useState<{lat: number, lng: number} | null>(
    draft?.selectedPos ?? null
  );

  useEffect(() => {
    if (location.state?.selectedLocation) {
      const pos = location.state.selectedLocation;
      setSelectedPos(pos);
      const current = loadDraft() ?? {};
      saveDraft({ ...current, selectedPos: pos });
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const locationLabel = selectedPos
    ? nearestBuilding(selectedPos.lat, selectedPos.lng)
    : null;

  const toggleStatus = () => setIsFound(v => !v);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setPhotoPreview(preview);
        saveDraft({ isFound, itemName, tag, category, description, photoPreview: preview, selectedPos });
      };
      reader.readAsDataURL(file);
    }
  };

  const goToMap = () => {
    saveDraft({ isFound, itemName, tag, category, description, photoPreview, selectedPos });
    navigate("/map");
  };

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      setErrorMessage("لطفاً نام آیتم را وارد کنید");
      setShowError(true); setTimeout(() => setShowError(false), 3000); return;
    }
    if (!category) {
      setErrorMessage("لطفاً دسته‌بندی را انتخاب کنید");
      setShowError(true); setTimeout(() => setShowError(false), 3000); return;
    }
    if (!photo && !photoPreview) {
      setErrorMessage("لطفاً عکس آپلود کنید");
      setShowError(true); setTimeout(() => setShowError(false), 3000); return;
    }

    const body = {
      type:               isFound ? "found" : "lost",
      title:              itemName,
      category_key:       category,
      tag:                tag || "",
      description:        description || "",
      publisher_username: "admin",
      location:           selectedPos
        ? { type: "Point", coordinates: [selectedPos.lng, selectedPos.lat] }
        : { type: "Point", coordinates: [51.3515, 35.7036] },
      image_url: null,
    };

    try {
      const response = await fetch("http://localhost:8000/posts/add", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      if (response.ok) {
        setErrorMessage("✓ آیتم با موفقیت ثبت شد");
        setShowError(true);
        clearDraft();
        setTimeout(() => {
          setShowError(false);
          setItemName(""); setTag(""); setCategory("");
          setDescription(""); setPhoto(null); setPhotoPreview("");
          setIsFound(false); setSelectedPos(null);
        }, 2000);
      } else {
        throw new Error("خطا در ذخیره‌سازی");
      }
    } catch {
      setErrorMessage("خطا در ذخیره‌سازی. مطمئن شوید سرور در حال اجراست");
      setShowError(true); setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    clearDraft();
    setItemName(""); setTag(""); setCategory("");
    setDescription(""); setPhoto(null); setPhotoPreview("");
    setIsFound(false); setSelectedPos(null);
  };

  return (
    <div className="entry-page-container">
      {showError && (
        <div className={`error-popup ${errorMessage.includes("✓") ? "success" : ""}`}>
          {errorMessage}
        </div>
      )}

      <div className="main-grid">

        <div className="form-column">
          <div className="neon-input-card">
            <input type="text" placeholder="نام آیتم" className="glass-input"
              value={itemName} onChange={e => setItemName(e.target.value)} />
          </div>
          <div className="neon-input-card">
            <input type="text" placeholder="تگ" className="glass-input"
              value={tag} onChange={e => setTag(e.target.value)} />
          </div>
          <div className="neon-input-card relative">
            <select className="glass-input appearance-none cursor-pointer"
              value={category} onChange={e => setCategory(e.target.value)}>
              <option value="" disabled>دسته بندی</option>
              <option value="electronics">الکترونیک</option>
              <option value="documents">مدارک</option>
              <option value="wallets">کیف پول / کارت</option>
              <option value="clothing">لباس</option>
              <option value="accessories">لوازم جانبی</option>
              <option value="keys">کلید</option>
              <option value="books">کتاب</option>
              <option value="other">سایر</option>
            </select>
            <span className="dropdown-arrow">▼</span>
          </div>
          <div className="neon-input-card">
            <textarea placeholder="توضیحات...." rows={6} className="glass-input resize-none"
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="status-container">
            <div className={`toggle-switch ${isFound ? "active" : ""}`} onClick={toggleStatus}>
              <div className="toggle-dot" />
            </div>
            <span className={`status-text ${isFound ? "found" : "lost"}`}>
              {isFound ? "پیدا شده" : "گم شده"}
            </span>
          </div>
        </div>

        <div className="media-column">
          <div className="form-map-preview group" onClick={goToMap}>
            <div className="h-full w-full opacity-60 group-hover:opacity-100 transition-opacity">
              <UniversityMap />
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2
                         opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: "var(--overlay)" }}
            >
              <span className="px-4 py-2 backdrop-blur-md rounded-full text-[10px]"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}>
                انتخاب موقعیت روی نقشه
              </span>
              {locationLabel && (
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(59,130,246,0.25)", border: "1px solid rgba(59,130,246,0.5)", color: "#93c5fd" }}>
                  📍 {locationLabel}
                </span>
              )}
            </div>

            {locationLabel && (
              <div className="absolute bottom-3 right-0 left-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md"
                  style={{ background: "rgba(59,130,246,0.35)", border: "1px solid rgba(59,130,246,0.6)", color: "#bfdbfe" }}>
                  📍 {locationLabel}
                </span>
              </div>
            )}
          </div>

          <div className="neon-input-card flex flex-col items-center justify-center p-14
                          border-dashed relative cursor-pointer hover:border-white/30 transition-all"
            style={{ borderColor: "var(--border-soft)" }}>
            <input type="file" accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload} />
            {photoPreview ? (
              <div className="relative w-full h-32 flex items-center justify-center">
                <img src={photoPreview} alt="preview"
                  className="max-h-full object-contain rounded-lg" />
              </div>
            ) : photo ? (
              <>
                <div className="text-green-400 text-4xl mb-2">✓</div>
                <span className="text-green-400 text-xs">{photo.name}</span>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2" style={{ color: "var(--text-muted)", opacity: 0.3 }}>📷</div>
                <span className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--text-muted)", opacity: 0.5 }}>Upload Photo</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="action-group">
        <button className="action-circle btn-cross" onClick={handleCancel}>✕</button>
        <button className="action-circle btn-check" onClick={handleSubmit}>✓</button>
      </div>
    </div>
  );
}

export default ItemEntryView;
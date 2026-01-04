import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UniversityMap from "../../components/map/UniversityMap";
import "../ItemEntry/ItemEntryStyle.css";
import "../MapView/MapViewStyle.css";

function EditView() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToEdit = location.state?.item;

  const [isFound, setIsFound] = useState(itemToEdit?.status === "پیدا شده");
  const [itemName, setItemName] = useState(itemToEdit?.itemName || "");
  const [tag, setTag] = useState(itemToEdit?.tag || "");
  const [category, setCategory] = useState(itemToEdit?.category || "");
  const [description, setDescription] = useState(itemToEdit?.description || "");
  const [photoPreview, setPhotoPreview] = useState(itemToEdit?.photoData || "");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => { if (!itemToEdit) navigate("/profile"); }, [itemToEdit, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!itemName.trim() || !tag.trim() || !category || !description.trim()) return;

    const updatedData = {
      ...itemToEdit, itemName, tag, category, description,
      status: isFound ? "پیدا شده" : "گم شده",
      photoData: photoPreview,
      photoName: newPhoto ? newPhoto.name : itemToEdit.photoName,
    };

    /*
    // === BACKEND API LOGIC ===
    // Method: PUT
    // URL: http://localhost:3001/lostAndFoundItems/${itemToEdit.id}
    // Body: JSON.stringify(updatedData)
    */
    const existing = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const updated = existing.map((i: any) => i.id === itemToEdit.id ? updatedData : i);
    localStorage.setItem('lostItems', JSON.stringify(updated));

    setErrorMessage("✓ ویرایش انجام شد");
    setShowError(true);
    setTimeout(() => { setShowError(false); navigate("/profile"); }, 1500);
  };

  if (!itemToEdit) return null;

  return (
    <div className="entry-page-container">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <h2 className="text-xl font-bold" style={{ color: '#e8ecff' }}>ویرایش آیتم</h2>
      </div>

      {showError && <div className={`error-popup success`}>{errorMessage}</div>}

      <div className="main-grid">
        <div className="form-column">
          <div className="neon-input-card"><input type="text" className="glass-input" value={itemName} onChange={(e) => setItemName(e.target.value)} /></div>
          <div className="neon-input-card"><input type="text" className="glass-input" value={tag} onChange={(e) => setTag(e.target.value)} /></div>
          <div className="neon-input-card relative">
            <select className="glass-input appearance-none" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="electronics">الکترونیک</option>
              <option value="documents">مدارک</option>
              <option value="other">سایر</option>
            </select>
          </div>
          <div className="neon-input-card"><textarea rows={6} className="glass-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="status-container">
            <div className={`toggle-switch ${isFound ? 'active' : ''}`} onClick={() => setIsFound(!isFound)}><div className="toggle-dot"></div></div>
            <span className={`status-text ${isFound ? 'found' : 'lost'}`}>{isFound ? 'پیدا شده' : 'گم شده'}</span>
          </div>
        </div>

        <div className="media-column">
           <div className="form-map-preview"><UniversityMap /></div>
           <div className="neon-input-card flex flex-col items-center justify-center p-14 border-dashed relative">
            <input type="file" className="absolute inset-0 opacity-0" onChange={handlePhotoUpload} />
            <img src={photoPreview} alt="Preview" className="max-w-full max-h-32 object-contain rounded-lg" />
            <div className="text-[10px] text-green-400 mt-2">{newPhoto ? "عکس جدید انتخاب شد" : "عکس قبلی"}</div>
          </div>
        </div>
      </div>
      <div className="action-group">
        <button className="action-circle btn-cross" onClick={() => navigate("/profile")}>✕</button>
        <button className="action-circle btn-check" onClick={handleSubmit}>✓</button>
      </div>
    </div>
  );
}

export default EditView;
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

  useEffect(() => {
    if (!itemToEdit) {
      navigate("/profile");
    }
  }, [itemToEdit, navigate]);

  const toggleStatus = () => {
    setIsFound(!isFound);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhoto(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // چک کردن فیلدها
    if (!itemName.trim()) {
      setErrorMessage("لطفاً نام آیتم را وارد کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    if (!tag.trim()) {
      setErrorMessage("لطفاً تگ را وارد کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    if (!category) {
      setErrorMessage("لطفاً دسته‌بندی را انتخاب کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    if (!description.trim()) {
      setErrorMessage("لطفاً توضیحات را وارد کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const updatedData = {
      ...itemToEdit,
      itemName,
      tag,
      category,
      description,
      status: isFound ? "پیدا شده" : "گم شده",
      photoData: photoPreview,
      photoName: newPhoto ? newPhoto.name : itemToEdit.photoName,
    };

    try {
      const response = await fetch(`http://localhost:3001/lostAndFoundItems/${itemToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setErrorMessage("✓ آیتم با موفقیت ویرایش شد");
        setShowError(true);
        
        setTimeout(() => {
          setShowError(false);
          navigate("/profile");
        }, 1500);
      } else {
        throw new Error('خطا در ویرایش');
      }
    } catch (error) {
      console.error('خطا:', error);
      setErrorMessage("خطا در ویرایش داده‌ها");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (!itemToEdit) return null;

  return (
    <div className="entry-page-container">
      {showError && (
        <div className={`error-popup ${errorMessage.includes('✓') ? 'success' : ''}`}>
          {errorMessage}
        </div>
      )}

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <h2 className="text-xl font-bold" style={{ color: '#e8ecff' }}>
          ویرایش آیتم
        </h2>
      </div>

      <div className="main-grid">
        
        <div className="form-column">
          <div className="neon-input-card">
            <input 
              type="text" 
              placeholder="نام آیتم" 
              className="glass-input" 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="neon-input-card">
            <input 
              type="text" 
              placeholder="تگ" 
              className="glass-input"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
          <div className="neon-input-card relative">
            <select 
              className="glass-input appearance-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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
            <textarea 
              placeholder="توضیحات...." 
              rows={6} 
              className="glass-input resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="status-container">
            <div 
              className={`toggle-switch ${isFound ? 'active' : ''}`}
              onClick={toggleStatus}
            >
              <div className="toggle-dot"></div>
            </div>
            <span className={`status-text ${isFound ? 'found' : 'lost'}`}>
              {isFound ? 'پیدا شده' : 'گم شده'}
            </span>
          </div>
        </div>

        <div className="media-column">
          <div className="form-map-preview group" onClick={() => navigate("/map")}>
            <div className="h-full w-full opacity-60 group-hover:opacity-100 transition-opacity">
              <UniversityMap />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all">
               <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] text-white">مشاهده نقشه کامل</span>
            </div>
          </div>
          
          <div className="neon-input-card flex flex-col items-center justify-center p-14 border-dashed border-white/10 relative cursor-pointer hover:border-white/30 transition-all">
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
            {photoPreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={photoPreview} 
                  alt="Preview"
                  className="max-w-full max-h-32 object-contain rounded-lg"
                />
                <div className="absolute bottom-0 right-0 text-green-400 text-xs">
                  {newPhoto ? "عکس جدید" : "عکس فعلی"}
                </div>
              </div>
            ) : (
              <>
                <div className="text-white/20 text-4xl mb-2">📷</div>
                <span className="text-white/30 text-[10px] uppercase tracking-widest">Upload Photo</span>
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

export default EditView;
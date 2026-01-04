import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UniversityMap from "../../components/map/UniversityMap";
import "./ItemEntryStyle.css";
import "../MapView/MapViewStyle.css";

function ItemEntryView() {
  const navigate = useNavigate();
  const [isFound, setIsFound] = useState(false);
  const [itemName, setItemName] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleStatus = () => {
    setIsFound(!isFound);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    
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
    if (!photo) {
      setErrorMessage("لطفاً عکس را آپلود کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

   
    const itemData = {
      itemName,
      tag,
      category,
      description,
      status: isFound ? "پیدا شده" : "گم شده",
      photoName: photo.name,
      photoData: photoPreview, 
      date: new Date().toLocaleDateString('fa-IR'),
      timestamp: new Date().toISOString()
    };

    try {
      
      const response = await fetch('http://localhost:3001/lostAndFoundItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        const savedItem = await response.json();
        console.log('✅ آیتم ذخیره شد:', savedItem);
        
       
        setErrorMessage("✓ آیتم با موفقیت ثبت شد");
        setShowError(true);
        
        setTimeout(() => {
          setShowError(false);
        
          setItemName("");
          setTag("");
          setCategory("");
          setDescription("");
          setPhoto(null);
          setPhotoPreview("");
          setIsFound(false);
        }, 2000);
      } else {
        throw new Error('خطا در ذخیره‌سازی');
      }
    } catch (error) {
      console.error('خطا:', error);
      setErrorMessage("خطا در ذخیره‌سازی. مطمئن شوید json-server در حال اجراست");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    setItemName("");
    setTag("");
    setCategory("");
    setDescription("");
    setPhoto(null);
    setPhotoPreview("");
    setIsFound(false);
  };

  return (
    <div className="entry-page-container">
      
      <div className="fixed top-6 right-8 z-50">
        <img 
          src="../public/logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

    
      {showError && (
        <div className={`error-popup ${errorMessage.includes('✓') ? 'success' : ''}`}>
          {errorMessage}
        </div>
      )}

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
            {photo ? (
              <>
                <div className="text-green-400 text-4xl mb-2">✓</div>
                <span className="text-green-400 text-xs">{photo.name}</span>
              </>
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

export default ItemEntryView;
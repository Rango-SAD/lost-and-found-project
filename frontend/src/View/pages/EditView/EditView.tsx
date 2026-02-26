import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UniversityMap from "../../components/map/UniversityMap";
import "../ItemEntry/ItemEntryStyle.css";
import "../MapView/MapViewStyle.css";

interface EditViewProps {
  token?: string;
}

function EditView({ token }: EditViewProps) {
  const navigate = useNavigate();
  const locationState = useLocation();
  const itemToEdit = locationState.state?.item;

  useEffect(() => {
    console.log("اطلاعات دریافت شده برای ویرایش:", itemToEdit);
  }, [itemToEdit]);

  // State initialization
  
  // Title
  const [title, setTitle] = useState(itemToEdit?.title || "");
  
  // Category Key
  const [categoryKey, setCategoryKey] = useState(itemToEdit?.category_key || "");
  
  // Tag
  const [tag, setTag] = useState(itemToEdit?.tag || "");
  
  // Description
  const [description, setDescription] = useState(itemToEdit?.description || "");
  
  // Lost / Found
  const [isFound, setIsFound] = useState(itemToEdit?.type === "found");

  // Image URL
  const [imageUrl, setImageUrl] = useState(itemToEdit?.image_url || "");
  
  // New image
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);

  // Error handling
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
      setNewPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      setErrorMessage("لطفاً عنوان آیتم را وارد کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    if (!categoryKey) {
      setErrorMessage("لطفاً دسته‌بندی را انتخاب کنید");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Payload Construction
    const locationData = itemToEdit?.location || {
      type: "Point",
      coordinates: [0, 0]
    };

    const updatedPayload = {
      title: title,
      category_key: categoryKey,
      tag: tag,
      description: description,
      type: isFound ? "found" : "lost",
      location: locationData,
      image_url: imageUrl
    };

    try {
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        setErrorMessage("خطای احراز هویت: توکن یافت نشد!");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      const response = await fetch(`http://localhost:8000/posts/${itemToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedPayload)
      });

      if (response.ok) {
        setErrorMessage("✓ آیتم با موفقیت ویرایش شد");
        setShowError(true);
        
        setTimeout(() => {
          setShowError(false);
          navigate(-1);
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server Error Response:", errorData);
        throw new Error('خطا در ویرایش');
      }
    } catch (error) {
      console.error('خطا:', error);
      setErrorMessage("خطا در ارتباط با سرور");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!itemToEdit) return null;

  return (
    <div className="entry-page-container">
      {showError && (
        <div className={`error-popup ${errorMessage.includes('✓') ? 'success' : ''}`}>
          {errorMessage}
        </div>
      )}

      <div className="main-grid">
        
        <div className="form-column">
          {/* Title Input */}
          <div className="neon-input-card">
            <input 
              type="text" 
              placeholder="نام آیتم (اجباری)" 
              className="glass-input" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          {/* Tag Input */}
          <div className="neon-input-card">
            <input 
              type="text" 
              placeholder="تگ (اختیاری)" 
              className="glass-input"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
          
          {/* Category Select */}
          <div className="neon-input-card relative">
            <select 
              className="glass-input appearance-none cursor-pointer"
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
            >
              <option value="" disabled>دسته بندی (اجباری)</option>
              {/* مقادیر value باید با مقادیر مورد قبول backend برای category_key یکی باشند */}
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
          
          {/* Description Textarea */}
          <div className="neon-input-card">
            <textarea 
              placeholder="توضیحات (اختیاری)" 
              rows={6} 
              className="glass-input resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status Toggle (Type) */}
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
          {/* Map Preview (Read Only) */}
          <div className="form-map-preview group cursor-not-allowed">
            <div className="h-full w-full opacity-60">
              <UniversityMap />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-transparent/40">
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="neon-input-card flex flex-col items-center justify-center p-14 border-dashed border-white/10 relative cursor-pointer hover:border-white/30 transition-all">
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
            {imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt="Preview"
                  className="max-w-full max-h-32 object-contain rounded-lg"
                />
                <div className="absolute bottom-0 right-0 text-green-400 text-xs bg-black/50 px-1 rounded">
                  {newPhotoFile ? "عکس جدید" : "عکس فعلی"}
                </div>
              </div>
            ) : (
              <>
                <div className="text-white/20 text-4xl mb-2">📷</div>
                <span className="text-white/30 text-[10px] uppercase tracking-widest">آپلود عکس (اختیاری)</span>
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

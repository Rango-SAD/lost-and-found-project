import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileViewStyle.css";

interface Item {
  id: number;
  itemName: string;
  tag: string;
  category: string;
  description: string;
  status: string;
  photoName: string;
  photoData?: string; // Base64 عکس
  date: string;
  timestamp: string;
}

function ProfileView() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/lostAndFoundItems');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('خطا در دریافت داده‌ها:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/lostAndFoundItems/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchItems();
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('خطا در حذف:', error);
    }
  };

  const handleEdit = (item: Item) => {
    navigate('/edit', { state: { item } });
  };

  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
    setActiveMenu(null);
  };

  return (
    <div className="profile-container">
      {/* لوگو */}
      <div className="fixed top-6 right-8 z-50">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* هدر پروفایل - بالا سمت راست */}
      <div className="profile-header-right">
        <h2 className="profile-title">نام کاربری</h2>
        <div className="profile-avatar">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>

      {/* گرید آیتم‌ها */}
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            {/* بج دسته‌بندی */}
            <div className={`category-badge category-${item.category}`}>
              {item.category === 'electronics' && 'الکترونیک'}
              {item.category === 'documents' && 'مدارک'}
              {item.category === 'wallets' && 'کیف پول'}
              {item.category === 'clothing' && 'لباس'}
              {item.category === 'accessories' && 'لوازم جانبی'}
              {item.category === 'keys' && 'کلید'}
              {item.category === 'books' && 'کتاب'}
              {item.category === 'other' && 'سایر'}
            </div>

            {/* منوی سه نقطه */}
            <div className="card-menu">
              <button 
                className="menu-button"
                onClick={() => toggleMenu(item.id)}
              >
                ⋯
              </button>
              
              {activeMenu === item.id && (
                <div className="menu-dropdown">
                  <button 
                    className="menu-item edit"
                    onClick={() => handleEdit(item)}
                  >
                    <span>✏️</span>
                    ویرایش آیتم
                  </button>
                  <button 
                    className="menu-item delete"
                    onClick={() => confirmDelete(item.id)}
                  >
                    <span>🗑️</span>
                    حذف آیتم
                  </button>
                </div>
              )}
            </div>

            {/* عکس */}
            <div className="card-image-wrapper">
              <div className="card-image">
                {item.photoData ? (
                  <img 
                    src={item.photoData} 
                    alt={item.itemName}
                    className="card-photo"
                  />
                ) : (
                  <svg className="placeholder-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                )}
              </div>
            </div>

            {/* محتوا */}
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{item.itemName}</h3>
                <span className="card-tag">{item.tag}</span>
              </div>
              <p className="card-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* پاپ‌آپ تایید حذف */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">حذف آیتم</h3>
            <p className="modal-text">آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                انصراف
              </button>
              <button 
                className="modal-btn confirm"
                onClick={() => itemToDelete && handleDelete(itemToDelete)}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileView;
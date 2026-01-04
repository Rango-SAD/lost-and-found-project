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
  photoData?: string;
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
    /* // === BACKEND API LOGIC ===
    // Method: GET 
    // URL: http://localhost:3001/lostAndFoundItems
    */
    
    let data = JSON.parse(localStorage.getItem('lostItems') || '[]');
    
    
    if (data.length === 0) {
      data = [
        {
          id: 101,
          itemName: "گوشی آیفون ۱۳",
          tag: "اپل - مشکی",
          category: "electronics",
          description: "در طبقه دوم کتابخانه جا مانده است. قاب سیلیکونی آبی دارد.",
          status: "پیدا شده", 
          photoName: "iphone.jpg",
          photoData: "",
          timestamp: new Date().toISOString()
        },
        {
          id: 102,
          itemName: "کارت دانشجویی",
          tag: "نام: علی رضایی",
          category: "documents",
          description: "کارت دانشجویی ورودی ۹۹ رشته کامپیوتر در سلف پیدا شده.",
          status: "پیدا شده",
          photoName: "card.jpg",
          photoData: "",
          timestamp: new Date().toISOString()
        },
        {
          id: 103,
          itemName: "دسته کلید",
          tag: "۳ کلید با جاکلیدی خرسی",
          category: "keys",
          description: "یک دسته کلید در محوطه پارکینگ شماره ۳ گم شده است.",
          status: "گم شده",
          photoName: "keys.jpg",
          photoData: "",
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem('lostItems', JSON.stringify(data));
    }
    
    setItems(data);
  };

  const handleDelete = async (id: number) => {
    /* // === BACKEND API LOGIC ===
    // Method: DELETE
    // URL: http://localhost:3001/lostAndFoundItems/${id}
    */
    const existing = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const filtered = existing.filter((i: Item) => i.id !== id);
    localStorage.setItem('lostItems', JSON.stringify(filtered));
    setItems(filtered);
    setShowDeleteConfirm(false);
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
      <div className="fixed top-6 right-8 z-50">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
      </div>

      <div className="profile-header-right">
        <h2 className="profile-title">نام کاربری</h2>
        <div className="profile-avatar">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>

      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
           
            <div className="flex justify-start mb-3">
              <div className={`category-badge category-${item.category}`}>
                {item.category === 'electronics' ? 'الکترونیک' : 
                 item.category === 'documents' ? 'مدارک' : 
                 item.category === 'keys' ? 'کلید' : 'سایر'}
              </div>
            </div>

            <div className="card-menu">
              <button className="menu-button" onClick={() => toggleMenu(item.id)}>⋯</button>
              {activeMenu === item.id && (
                <div className="menu-dropdown">
                  <button className="menu-item edit" onClick={() => handleEdit(item)}>
                    <span>✏️</span> ویرایش
                  </button>
                  <button className="menu-item delete" onClick={() => confirmDelete(item.id)}>
                    <span>🗑️</span> حذف
                  </button>
                </div>
              )}
            </div>

            <div className="card-image-wrapper">
              <div className="card-image">
                {item.photoData ? (
                  <img src={item.photoData} alt={item.itemName} className="card-photo" />
                ) : (
                  <div className="placeholder-icon">🖼️</div>
                )}
              </div>
            </div>

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

      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">حذف آیتم</h3>
            <p className="modal-text">آیا از حذف این مورد اطمینان دارید؟</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowDeleteConfirm(false)}>انصراف</button>
              <button className="modal-btn confirm" onClick={() => itemToDelete && handleDelete(itemToDelete)}>حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileView;
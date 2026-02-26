import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileViewStyle.css";

interface ProfileViewProps {
  username: string;
  token?: string; 
}

interface Item {
  id: string;
  type: "lost" | "found";
  title: string;
  category_key: string;
  tag: string;
  description: string;
  publisher_username: string;
  location: {
    type: string;
    coordinates: number[];
  };
  reports_count: number;
  image_url: string;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  electronics: 'الکترونیکی',
  documents: 'مدارک',
  keys: 'کلید',
  clothing: 'پوشاک',
  wallets: 'کیف پول / کارت',
  accessories: 'لوازم جانبی',
  books: 'کتاب',
  other: 'سایر'
};

const ProfileView: React.FC<ProfileViewProps> = ({ username, token }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const API_URL = `http://localhost:8000/posts/`;

  useEffect(() => {
    if (username) {
      fetchItems();
    }
  }, [username]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}publisher/${username}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("خطا در دریافت داده‌ها از سرور");
      }
    } catch (error) {
      console.error("ارتباط با سرور برقرار نشد:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const authToken = token || localStorage.getItem("token");

      const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } else {
        alert("خطا در حذف آیتم از سرور");
      }
    } catch (error) {
      console.error("خطا در عملیات حذف:", error);
    }
  };

  const handleEdit = (item: Item) => {
    navigate('/edit', { state: { item } });
  };

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
    setActiveMenu(null);
  };

  return (
    <div className="profile-container min-h-screen">
      <div className="fixed top-6 right-8 z-50">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
      </div>

      <div className="items-grid pt-24"> 
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="item-card relative">
              

              <div className="flex justify-between items-center mb-3 px-1">
                <div className={`category-badge category-${item.category_key}`}>
                  {categoryLabels[item.category_key] || item.category_key}
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
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="card-photo" />
                  ) : (
                    <div className="placeholder-icon">🖼️</div>
                  )}
                </div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{item.title}</h3>
                  {item.tag && <span className="card-tag">{item.tag}</span>}
                </div>
                <p className="card-description">{item.description || "بدون توضیحات"}</p>
                <div className="text-right mt-2 text-xs text-white/40">
                  {new Date(item.created_at).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full col-span-full py-10" style={{ color: "var(--text-primary)" }}>
            موردی جهت نمایش یافت نشد.
          </div>
        )}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileViewStyle.css";

interface ProfileViewProps {
  username: string;
  token?: string; 
}

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

const ProfileView: React.FC<ProfileViewProps> = ({ username, token }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
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

  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const confirmDelete = (id: number) => {
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

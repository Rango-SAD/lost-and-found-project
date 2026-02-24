import { useLocation, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { LoginPage } from "./View/pages/LoginPage"
import { RegisterPage } from "./View/pages/RegisterPage"
import { RequestCodePage } from "./View/pages/RequestCodePage"
import ItemEntryView from './View/pages/ItemEntry/ItemEntryView'
import MapView from './View/pages/MapView/MapView'
import ProfileView from './View/pages/ProfileView/ProfileView'
import EditView from './View/pages/EditView/EditView'
import Navbar from './View/components/navbar/Navbar'
import { Header } from './View/components/Header/Header'
import { PostsPage } from "./View/pages/PostsPage.tsx"

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("کاربر مهمان");

  const authPages = ['/login', '/register/verify', '/register/complete'];
  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      setUsername("کاربر مهمان");
    }
  }, [location.pathname]);

  const handleExit = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("کاربر مهمان");
    navigate('/login');
  };

  return (
    <>
      {!isAuthPage && (
        <>
          <Header onExit={handleExit} username={username} />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/posts" element={<PostsPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/complete" element={<RegisterPage />} />
        <Route path="/register/verify" element={<RequestCodePage />} />
        <Route path="/newItem" element={<ItemEntryView />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/edit" element={<EditView />} />
        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </>
  )
}
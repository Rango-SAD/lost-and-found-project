import { useLocation, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { LoginPage } from "./View/pages/LoginPage"
import { RegisterPage } from "./View/pages/RegisterPage"
import { RequestCodePage } from "./View/pages/RequestCodePage"
import ItemEntryView from './View/pages/ItemEntry/ItemEntryView'
import MapView from './View/pages/MapView/MapView'
import ProfileView from './View/pages/ProfileView/ProfileView'
import EditView from './View/pages/EditView/EditView'
import Navbar from './View/components/navbar/Navbar'
import { Header } from './View/components/Header/Header'
import {PostsPage} from "./View/pages/PostsPage.tsx";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const authPages = ['/login', '/register', '/register/code'];
  const isAuthPage = authPages.includes(location.pathname);

  const handleExit = () => {
    console.log("خروج از سیستم");
    navigate('/login');
  };

  return (
    <>

      {!isAuthPage && (
        <>
          <Header onExit={handleExit} username="نام کاربری" />
          <Navbar />
        </>
      )}

      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/code" element={<RequestCodePage />} />

        <Route path="/newItem" element={<ItemEntryView />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/edit" element={<EditView />} />

        <Route path="/posts" element={<PostsPage/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
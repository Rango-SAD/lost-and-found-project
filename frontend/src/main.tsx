import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import ItemEntryView from './View/pages/ItemEntry/ItemEntryView'
import MapView from './View/pages/MapView/MapView'
import Navbar from './View/components/navbar/Navbar'
import ProfileView from './View/pages/ProfileView/ProfileView'
import EditView from './View/pages/EditView/EditView'
import { Header } from './View/components/Header/Header'

function AppContent() {
  const navigate = useNavigate();

  const handleExit = () => {
    console.log("خروج از سیستم");
    navigate('/');
  };

  return (
    <>
      <Header onExit={handleExit} username="نام کاربری" />
      <Navbar />
      <Routes>
        <Route path="/newItem" element={<ItemEntryView />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/edit" element={<EditView />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </StrictMode>,
)
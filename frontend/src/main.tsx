import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ItemEntryView from './View/pages/ItemEntry/ItemEntryView'
import MapView from './View/pages/MapView/MapView'
import Navbar from './View/components/navbar/Navbar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemEntryView />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
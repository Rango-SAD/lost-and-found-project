import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import MapView from './View/pages/MapView/MapView'
import Navbar from './View/components/navbar/Navbar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
      <Navbar />
      <MapView />
    </BrowserRouter>
  </StrictMode>,
)
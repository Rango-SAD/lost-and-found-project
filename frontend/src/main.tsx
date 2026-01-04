import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ۱. این خط را اضافه کنید
import MapView from './View/pages/MapView/MapView'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* ۲. دور مپ ویو را با این تگ بپوشانید */}
      <MapView />
    </BrowserRouter>
  </StrictMode>,
)
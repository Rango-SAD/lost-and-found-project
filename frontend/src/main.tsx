import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './Infrastructure/Contexts/ThemeContext.tsx'
import { ToastProvider } from './View/components/ui/ToastProvider'
import './index.css'
import App from './App.tsx'
import logo from './View/assets/favicon.svg'

const favicon = document.querySelector<HTMLLinkElement>("link[rel~='icon']") || document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/svg+xml'
favicon.href = logo
document.head.appendChild(favicon)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
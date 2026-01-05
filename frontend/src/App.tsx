import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "./View/pages/LoginPage"
import { RegisterPage } from "./View/pages/RegisterPage"
import { RequestCodePage } from "./View/pages/RequestCodePage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/code" element={<RequestCodePage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
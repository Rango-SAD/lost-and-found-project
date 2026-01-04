import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./View/pages/LoginPage"
import { RegisterPage } from "./View/pages/RegisterPage"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
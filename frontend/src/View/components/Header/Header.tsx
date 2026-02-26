import React from 'react';
import logo from "../../assets/logo.png";
import { useTheme } from '../../../Infrastructure/Contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onExit?: () => void;
}

const HEADER_H = 72;

const Header: React.FC<HeaderProps> = ({ 
  onExit
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUsername = localStorage.getItem("username");
  const isLoggedIn = !!token;

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      if (onExit) onExit();
      window.location.href = "/posts"; 
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ 
        height: HEADER_H,
        background: theme === "light" 
          ? "rgba(244, 247, 251, 0.85)" 
          : "rgba(11, 15, 26, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: theme === "light"
          ? "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)"
          : "0 1px 3px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.15)"
      }}
    >
      <div className="mx-auto h-full w-full px-6 md:px-10">
        <div className="flex items-center justify-between h-full">
          
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-2.5 rounded-full px-3.5 py-2 transition-all hover:scale-[1.02]"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-soft)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <div className="text-right">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {isLoggedIn ? (storedUsername || "کاربر") : "کاربر مهمان"}
                </div>
              </div>
              <div
                className="grid h-8 w-8 place-items-center rounded-full transition-all"
                style={{
                  background: "var(--surface-3)",
                  border: "1px solid var(--border-soft)",
                  color: "var(--text-primary)"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                  <path d="M20 20a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-soft)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
              onClick={handleAuthAction}
            >
              {isLoggedIn ? "خروج" : "ورود"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-2.5 transition-all hover:scale-[1.05]"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-soft)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center h-full">
            <img
              src={logo}
              alt="لوگو"
              className="h-16 w-auto select-none transition-all hover:scale-[1.02]"
              style={{
                filter: theme === "dark" ? "none" : "brightness(0.95)",
                marginTop: "25%"
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header, HEADER_H };
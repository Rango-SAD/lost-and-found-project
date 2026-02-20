import React from 'react';
import logo from "../../assets/logo.png";
import { useTheme } from '../../../Infrastructure/Contexts/ThemeContext';

interface HeaderProps {
  onExit?: () => void;
  username?: string;
}

const HEADER_H = 80;

const Header: React.FC<HeaderProps> = ({
  onExit = () => console.log("exit"),
  username = "نام کاربری"
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ height: HEADER_H }}>
      <div
        className="h-full w-full backdrop-blur-2xl"
        style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="mx-auto h-full w-full px-10 pt-4">
          <div className="flex items-start justify-between">

            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-3 rounded-full px-4 py-2"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border-soft)" }}
              >
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {username}
                  </div>
                </div>
                <div
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{
                    background: "var(--surface-3)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-primary)"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                    <path d="M20 20a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                  </svg>
                </div>
              </div>

              <button
                type="button"
                className="rounded-full px-4 py-2 transition-colors"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-soft)"
                }}
                onClick={onExit}
                title="خروج"
              >
                خروج
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                title={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
                className="rounded-full px-3 py-2 transition-colors"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-soft)"
                }}
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center">
              <img src={logo} alt="لوگو" className="h-16 w-auto select-none" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header, HEADER_H };
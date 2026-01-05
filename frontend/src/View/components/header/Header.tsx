import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/logo.png";

interface HeaderProps {
    onExit?: () => void;
    username?: string;
}

const HEADER_H = 110;

const Header: React.FC<HeaderProps> = ({
                                           onExit = () => {},
                                           username = "نام کاربری"
                                       }) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <header
            className="fixed top-0 left-0 right-0 z-50"
            style={{height: HEADER_H}}
        >
            <div className="h-full w-full bg-[#0b0f1a]/70 backdrop-blur-2xl">
                <div className="mx-auto h-full w-full px-10 pt-6">
                    <div className="flex items-start justify-between">
                        {/* Right: bigger logo */}
                        <div className="flex items-center">
                            <img
                                src={logo}
                                alt="لوگو"
                                className="h-16 w-auto select-none"
                            />
                        </div>

                        {/* Left: exit + profile */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="rounded-full bg-white/8 px-4 py-2 text-ink-1 ring-1 ring-white/10 hover:bg-white/10"
                                onClick={() => navigate('/')}
                                title="خروج"
                            >
                                خروج
                            </button>

                            <div
                                className="flex items-center gap-3 rounded-full bg-white/8 px-4 py-2 ring-1 ring-white/10">
                                <div
                                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 text-ink-1">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            opacity="0.9"
                                        />
                                        <path
                                            d="M20 20a8 8 0 1 0-16 0"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            opacity="0.9"
                                        />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-ink-0">نام کاربری</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 h-px w-full bg-white/10"/>
                </div>
            </div>
        </header>
    );
};

export {Header, HEADER_H};
import React, { useState } from "react";
import { FaUser, FaCog, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

const Navbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const navigate = useNavigate();

    const buttonStyle = {
        position: "relative",
        background: "var(--surface)",
        color: "var(--text-primary)",
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
    };

    const underlineStyle = {
        content: "''",
        position: "absolute",
        left: 0,
        bottom: "-4px",
        width: "100%",
        height: "2px",
        backgroundColor: "var(--primary)",
        transform: "scaleX(0)",
        transition: "transform 0.3s ease",
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-[var(--background)] p-3 sm:p-4 shadow-md relative border-b border-[var(--surface)]">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
                {/* Logo */}
                <div onClick={() => navigate("/")} className="text-[var(--primary)] text-xl sm:text-2xl font-bold flex items-center h-full">
                    <img
                        
                        className="h-full w-auto"
                        src="/Chirp.svg"
                        alt="Chirp Logo"
                    />
                    <p className="text-[var(--text-primary)]">CHIRP</p>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 text-base sm:text-lg">
                    {/* Profile Button */}
                    <button
                        onClick={() => navigate("/profile")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("profile")}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="px-2 sm:px-4"
                    >
                        <FaUser className="text-sm sm:text-base" />
                        <span className="px-1 sm:px-2">Profile</span>
                        <span
                            style={{
                                ...underlineStyle,
                                transform:
                                    hoveredButton === "profile"
                                        ? "scaleX(1)"
                                        : "scaleX(0)",
                            }}
                        />
                    </button>

                    {/* Settings Button */}
                    <button
                        onClick={() => navigate("/settings")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("settings")}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="px-2 sm:px-4"
                    >
                        <FaCog className="text-sm sm:text-base" />
                        <span className="px-1 sm:px-2">Settings</span>
                        <span
                            style={{
                                ...underlineStyle,
                                transform:
                                    hoveredButton === "settings"
                                        ? "scaleX(1)"
                                        : "scaleX(0)",
                            }}
                        />
                    </button>

                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate("/notis")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("notis")}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="px-2 sm:px-4"
                    >
                        <FaBell className="text-sm sm:text-base" />
                        <span className="px-1 sm:px-2">Notis</span>
                        <span
                            style={{
                                ...underlineStyle,
                                transform:
                                    hoveredButton === "notis"
                                        ? "scaleX(1)"
                                        : "scaleX(0)",
                            }}
                        />
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[var(--text-primary)] hover:text-[var(--primary)]"
                    onClick={toggleMobileMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                                isMobileMenuOpen
                                    ? "M6 18L18 6M6 6l12 12"
                                    : "M4 6h16M4 12h16m-16 6h16"
                            }
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full right-0 w-48 mt-2 py-2 bg-[var(--surface)] border border-[var(--secondary-dark)] rounded-lg shadow-xl md:hidden z-50">
                    <button
                        onClick={() => {
                            navigate("/profile");
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--text-primary)]"
                    >
                        <FaUser className="text-lg" />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={() => {
                            navigate("/settings");
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--text-primary)]"
                    >
                        <FaCog className="text-lg" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={() => {
                            navigate("/notis");
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--text-primary)]"
                    >
                        <FaBell className="text-lg" />
                        <span>Notifications</span>
                    </button>
                </div>
            )}

            {/* Popup Confirmation */}
            {isPopupOpen && <Popup setIsPopupOpen={setIsPopupOpen} />}
        </header>
    );
};

export default Navbar;

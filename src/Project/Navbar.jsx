import React, { useState } from "react";
import { FaUser, FaCog, FaBell, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup"; // Import the Popup component

const Navbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const navigate = useNavigate();

    // const handleLogoutClick = () => {
    //     setIsPopupOpen(true); // Show the popup when logout is clicked
    // };

    // Styles for the buttons
    const buttonStyle = {
        position: "relative",
        background: "inherit",
        color: "white", // Tailwind's blue-500
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem", // Tailwind's rounded-md
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "color 0.3s ease",
    };

    const underlineStyle = {
        content: "''",
        position: "absolute",
        left: 0,
        bottom: "-4px", // Adjust position of underline
        width: "100%",
        height: "2px", // Thickness of underline
        backgroundColor: "#3B82F6", // Underline color
        transform: "scaleX(0)", // Start with no width
        transition: "transform 0.3s ease",
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-background p-3 sm:p-4 shadow-md relative">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
                {/* Logo */}
                <div className="text-primary text-xl sm:text-2xl font-bold flex items-center h-full">
                    <img
                        onClick={() => navigate("/")}
                        className="h-full w-auto"
                        src="/Chirp.svg"
                        alt="Chirp Logo"
                    />
                    <p className="text-primary">CHIRP</p>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 text-base sm:text-lg">
                    {/* Home Button */}
                    {/* <button
                        onClick={() => navigate("/main")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("home")}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="px-2 sm:px-4"
                    >
                        <FaHome className="text-sm sm:text-base" />
                        <span className="px-1 sm:px-2">Home</span>
                        <span
                            style={{
                                ...underlineStyle,
                                transform:
                                    hoveredButton === "home"
                                        ? "scaleX(1)"
                                        : "scaleX(0)",
                            }}
                        />
                    </button> */}

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
                    className="md:hidden text-white p-2"
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
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 shadow-lg z-50">
                    <div className="flex flex-col p-4 space-y-3">
                        {/* <button
                            onClick={() => {
                                navigate("/main");
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
                        >
                            <FaHome className="text-lg" />
                            <span>Home</span>
                        </button> */}
                        <button
                            onClick={() => {
                                navigate("/profile");
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
                        >
                            <FaUser className="text-lg" />
                            <span>Profile</span>
                        </button>
                        <button
                            onClick={() => {
                                navigate("/settings");
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
                        >
                            <FaCog className="text-lg" />
                            <span>Settings</span>
                        </button>
                        <button
                            onClick={() => {
                                navigate("/notis");
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
                        >
                            <FaBell className="text-lg" />
                            <span>Notis</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Popup Confirmation */}
            {isPopupOpen && <Popup setIsPopupOpen={setIsPopupOpen} />}
        </header>
    );
};

export default Navbar;

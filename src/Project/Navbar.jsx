import React, { useState } from "react";
import { FaUser, FaCog, FaBell, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup"; // Import the Popup component

const Navbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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

    // State for hover effect on each button
    const [hoveredButton, setHoveredButton] = useState(null);

    return (
        <header className="bg-gray-900 p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-white text-2xl font-bold flex items-center space-x-2">
                    <img
                        className="w-12 h-12"
                        src="/chirplogo.png"
                        alt="Chirp Logo"
                    />
                    <span>Chirp</span>
                </div>

                {/* Navigation Links */}
                <nav className="space-x-4 text-lg hidden md:flex items-center">
                    {/* Home Button */}
                    <button
                        onClick={() => navigate("/main")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("home")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <FaHome />
                        <span className="px-2">Home</span>
                        <span
                            style={{
                                ...underlineStyle,
                                transform:
                                    hoveredButton === "home"
                                        ? "scaleX(1)"
                                        : "scaleX(0)",
                            }}
                        />
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={() => navigate("/profile")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("profile")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <FaUser />
                        <span className="px-2">Profile</span>
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
                    >
                        <FaCog />
                        <span className="px-2">Settings</span>
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
                    <button
                        onClick={() => navigate("/notis")}
                        style={buttonStyle}
                        onMouseEnter={() => setHoveredButton("notis")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <FaBell />
                        <span className="px-2">Notis</span>
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

                {/* Log Out Button */}
            </div>

            {/* Popup Confirmation */}
            {isPopupOpen && (
                <Popup
                    setIsPopupOpen={setIsPopupOpen} // Pass function to close the popup
                />
            )}
        </header>
    );
};

export default Navbar;

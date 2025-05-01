import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaPalette } from "react-icons/fa";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";

const Settings = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }

        // If no saved preference, check system preference
        const systemPreference = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        return systemPreference.matches;
    });
    

    const Button = ({ children, onClick, className }) => {
        return (
            <button
                onClick={onClick}
                className={`px-4 py-2 rounded-lg font-medium ${className}`}
            >
                {children}
            </button>
        );
    };
    
    const Dialog = ({ children, onClose, className }) => {
        return (
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center ${className}`}
                onClick={onClose}
            >
                <div
                    className="bg-surface rounded-lg border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        );
    };



    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e) => {
            // Only update if there's no saved preference
            if (!localStorage.getItem("theme")) {
                setIsDarkMode(e.matches);
            }
        };

        // Add listener for system theme changes
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup listener
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Apply theme changes
    useEffect(() => {
        // Update DOM
        document.documentElement.classList.toggle("dark", isDarkMode);

        // Update localStorage
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]'
        );
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                "content",
                isDarkMode ? "#111827" : "#ffffff"
            );
        }
    }, [isDarkMode]);

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            await apiEndpoints.logout({refreshToken});
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            // Update localStorage immediately
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    };

    return (
        <div className="relative bg-dark-background h-[90dvh] flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Enhanced Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl max-h-[75vh] overflow-y-auto custom-scrollbar">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-6 sm:mb-8">
                    Settings
                </h1>
                <div className="space-y-4 sm:space-y-6">
                    {/* Theme Toggle */}
                    <div className="bg-surface border border-gray-700 rounded-xl p-4 hover:border-primary transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <FaPalette className="text-2xl text-primary" />
                                <div>
                                    <h2 className="text-lg font-semibold text-primary">
                                        Theme
                                    </h2>
                                    <p className="text-muted">Switch theme</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="px-4 py-2 rounded-lg font-medium bg-primary text-primary hover:bg-primary-dark transition-colors duration-300"
                            >
                                {isDarkMode ? "Light Mode" : "Dark Mode"}
                            </button>
                        </div>
                    </div>
                    {/* Logout Button */}
                    <div className="bg-surface border border-gray-700 rounded-xl p-4 hover:border-primary transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <FaSignOutAlt className="text-2xl text-primary" />
                                <div>
                                    <h2 className="text-lg font-semibold text-primary">
                                        Logout
                                    </h2>
                                    <p className="text-muted">
                                        Sign out of your account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsPopupOpen(true)}
                                className="px-4 py-2 rounded-lg font-medium bg-primary text-primary hover:bg-primary-dark transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* {isPopupOpen && <Popup setIsPopupOpen={setIsPopupOpen} />} */}
            {isPopupOpen && (
                <Dialog
                    onClose={() => setIsPopupOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-surface p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md border border-gray-700"
                    >
                        <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">
                            Confirm Logout
                        </h2>
                        <p className="text-muted mb-4 sm:mb-6 text-sm sm:text-base">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-end gap-3 sm:gap-4">
                            <Button
                                onClick={() => setIsPopupOpen(false)}
                                className="bg-surface text-primary hover:bg-surface/80 text-sm sm:text-base px-3 sm:px-4 py-2 border border-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleLogout()}
                                className="bg-primary text-primary hover:bg-primary-dark text-sm sm:text-base px-3 sm:px-4 py-2"
                            >
                                Logout
                            </Button>
                        </div>
                    </motion.div>
                </Dialog>
            )}
        </div>
    );
};

export default Settings;

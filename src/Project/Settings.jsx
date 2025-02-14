import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaPalette } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";
import Popup from "./Popup";

const Settings = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        
        // If no saved preference, check system preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
        return systemPreference.matches;
    });

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Only update if there's no saved preference
            if (!localStorage.getItem('theme')) {
                setIsDarkMode(e.matches);
            }
        };

        // Add listener for system theme changes
        mediaQuery.addEventListener('change', handleChange);

        // Cleanup listener
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply theme changes
    useEffect(() => {
        // Update DOM
        document.documentElement.classList.toggle('dark', isDarkMode);
        
        // Update localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                isDarkMode ? '#111827' : '#ffffff'
            );
        }
    }, [isDarkMode]);

    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsPopupOpen(true);

        try {
            
            await apiEndpoints.logout();
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            // Update localStorage immediately
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    return (
        <main className="p-4 h-auto flex items-center justify-center min-h-screen -mt-20">
            <div className="rounded-lg w-full max-w-2xl">
                <div className="mx-auto">
                    <div className="rounded-xl shadow-lg p-6 space-y-6 bg-white">
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <FaPalette className="text-2xl text-purple-500" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Theme
                                    </h2>
                                    <p className="text-gray-500">
                                        Switch between light and dark mode
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="px-6 py-2.5 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200"
                            >
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>

                        {/* Logout Button */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <FaSignOutAlt className="text-2xl text-red-500" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Logout
                                    </h2>
                                    <p className="text-gray-500">
                                        Sign out of your account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <Popup
                    setIsPopupOpen={setIsPopupOpen} // Pass function to close the popup
                />
            )}
        </main>
    );
};

export default Settings;

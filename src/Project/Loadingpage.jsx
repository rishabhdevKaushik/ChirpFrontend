import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";
const LoadingScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const checkLoginStatus = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            await apiEndpoints.refershAuthenticationToken(refreshToken);
            localStorage.setItem("islogged", true);
            return true;
        } catch (error) {
            console.error("Authentication error:", error);
            localStorage.setItem("islogged", false);
            return false;
        }
    }, []);

    useEffect(() => {
        let progressInterval;
        let navigationTimeout;

        const initializeLoading = async () => {
            const isLoggedIn = await checkLoginStatus();

            // Start progress animation
            progressInterval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
            }, 60);

            // Setup navigation
            navigationTimeout = setTimeout(() => {
                setIsLoading(false);
                navigate(isLoggedIn ? "/main" : "/login");
            }, 2000);
        };

        initializeLoading();

        // Cleanup function
        return () => {
            clearInterval(progressInterval);
            clearTimeout(navigationTimeout);
        };
    }, [navigate, checkLoginStatus]);

    // Early return if not loading
    if (!isLoading) return null;

    return (
        <div className="relative bg-dark-background bg-cover h-screen flex items-center justify-center ">
            {/* Enhanced Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative flex flex-col items-center">
                <img src="/Chirp.svg" alt="Logo" className="mb-4" />
                <div className="relative w-64 bg-surface rounded-full h-2.5 mb-4">
                    <div
                        className="relative bg-accent h-2.5 rounded-full"
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            transition: "width 0.05s ease-in-out",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

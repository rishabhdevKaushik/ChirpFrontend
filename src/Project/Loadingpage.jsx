import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";
const LoadingScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const checkLoginStatus = useCallback(async () => {
        let tokenres = { status: 400 };

        try {
            tokenres = await apiEndpoints.refershauthenticationtoken();
        } catch (error) {
            console.error('Authentication error:', error);
        }

        const isLoggedIn = tokenres.status === 200;
        localStorage.setItem("islogged", String(isLoggedIn));
        
        return isLoggedIn;
    }, []);

    useEffect(() => {
        let progressInterval;
        let navigationTimeout;

        const initializeLoading = async () => {
            const isLoggedIn = await checkLoginStatus();

            // Start progress animation
            progressInterval = setInterval(() => {
                setProgress(prev => prev >= 100 ? 100 : prev + 2);
            }, 50);

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
        <div className="bg-gray-900 h-screen flex items-center justify-center bg-cover">
            <div className="flex flex-col items-center">
                <img src="/chirplogo.png" alt="Logo" className="mb-4" />
                <div className="w-64 bg-gray-300 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
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

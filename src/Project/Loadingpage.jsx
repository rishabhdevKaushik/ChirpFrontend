import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated import
import { useContext } from "react"; // If you're using context

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Use navigate for routing in v6

  useEffect(() => {
    // Simulate an API call or check login status
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("loggedIn"); // Assuming you store login status in localStorage
      setIsLoggedIn(loggedIn === "true");

      setTimeout(() => {
        setIsLoading(false);
        if (loggedIn === "true") {
          navigate("/main");  // Redirect to main page if logged in
        } else {
          navigate("/login"); // Redirect to login page if not logged in
        }
      }, 2000); // Simulate loading time (e.g., 2 seconds)
    };

    checkLoginStatus();
  }, [navigate]); // include navigate in the dependency array

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid w-16 h-16 mb-4"></div>
          <span className="text-xl font-semibold text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return null; // You won't reach this part because of the redirect
};

export default LoadingScreen;

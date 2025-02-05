import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";
const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0); // State for progress bar
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate an API call or check login status
    const checkLoginStatus =async () => {
      var tokenres = {
        status : 400
      };

      try {
        tokenres = await apiEndpoints.refershauthenticationtoken();
        // console.log(tokenres.status);
        
      } catch (error) {
        // console.log(error);
        
      }
      localStorage.setItem("islogged", tokenres.status===200? "true" : "false");
      
      
      const loggedIn = localStorage.getItem("islogged"); // Check login status from localStorage
      setIsLoggedIn(loggedIn);

      // Start progress bar animation
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval); // Clear the interval when progress reaches 100%
            return 100;
          }
          return prevProgress + 2; // Increase progress by 2% every interval
        });
      }, 100); // Update progress every 100ms

      // After 2 seconds, stop loading and navigate to the appropriate page
      setTimeout(() => {
        setIsLoading(false);
        if (loggedIn === "true") {
          navigate("/main"); // Redirect to main page if logged in
        } else {
          navigate("/login"); // Redirect to login page if not logged in
        }
      }, 2000); // Simulate loading time (e.g., 2 seconds)
    };

    checkLoginStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 h-screen flex items-center justify-center bg-cover">
        <div className="flex flex-col items-center">
          <img src="/chirplogo.png" alt="Logo" className="mb-4" />
          <div className="w-64 bg-gray-300 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${progress}%`, // Set dynamic width
                transition: "width 0.1s ease-in-out", // Smooth transition
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return null; 
};

export default LoadingScreen;

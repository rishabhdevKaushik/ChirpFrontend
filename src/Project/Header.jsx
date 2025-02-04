import React, { useState } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup'; // Import the Popup component

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsPopupOpen(true); // Show the popup when logout is clicked
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold flex items-center space-x-2">
          <FaUser className="text-3xl" />
          <span>ChatApp</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-x-4 hidden md:flex items-center">
          {/* Home Button */}
          <button
            onClick={() => navigate('/')}
            className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-1"
          >
            <FaHome />
            <span>Home</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => navigate('/profile')}
            
            
            className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-1"
          >
            <FaUser />
            <span>Profile</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => navigate('/settings')}
            className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-1"
          >
            <FaCog />
            <span>Settings</span>
          </button>
        </nav>

        {/* Log Out Button */}
        <div className="flex items-center space-x-4">
          <button
            className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-1 focus:outline-none"
            onClick={handleLogoutClick}
          >
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
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

export default Header;

import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUserEdit, FaBan } from "react-icons/fa";
import { apiEndpoints } from "../Api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [popupContent, setPopupContent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.listPendingRequests();
      setPendingRequests(response.data.pendingRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
    setLoading(false);
  };

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.listBlockedUsers();
      setBlockedUsers(response.data.blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
    setLoading(false);
  };

  // Unblock user
  const handleUnblockUser = async (username) => {
    setLoading(true);
    try {
      await apiEndpoints.unblockUser(username);
      setBlockedUsers(blockedUsers.filter((user) => user.username !== username));
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
    setLoading(false);
  };

  // Accept friend request
  const handleAcceptRequest = async (username) => {
    setLoading(true);
    try {
      await apiEndpoints.updateFriendRequest({ status: "ACCEPT" }, username);
      fetchPendingRequests();
    } catch (error) {
      console.error("Error accepting user:", error);
    }
    setLoading(false);
  };

  // Reject friend request
  const handleRejectRequest = async (username) => {
    setLoading(true);
    try {
      await apiEndpoints.updateFriendRequest({ status: "REJECT" }, username);
      fetchPendingRequests();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
    setLoading(false);
  };

  // Block user
  const handleBlockRequest = async (username) => {
    setLoading(true);
    try {
      await apiEndpoints.blockUser(username);
      fetchPendingRequests();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
    setLoading(false);
  };

  const handleCardClick = (card) => {
    setPopupContent(card);
    setIsPopupOpen(true);
    if (card.title === "List of Pending Requests") fetchPendingRequests();
    if (card.title === "Blocked Users") fetchBlockedUsers();
    if (card.title === "User Updates") navigate("/updateprofile");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const cardsData = [
    { title: "List of Pending Requests", icon: <FaUserPlus className="text-green-500 text-3xl" /> },
    { title: "Blocked Users", icon: <FaBan className="text-red-500 text-3xl" /> },
    { title: "User Updates", icon: <FaUserEdit className="text-yellow-500 text-3xl" /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/bg1.jpeg')" }}>
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

      <div className="relative z-10 w-full max-w-4xl bg-gray-900 bg-opacity-70 rounded-lg shadow-xl p-8 sm:p-10 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-center mb-8">
          Profile Overview
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 p-6 rounded-xl text-center cursor-pointer flex flex-col items-center"
              onClick={() => handleCardClick(card)}
            >
              {card.icon}
              <h2 className="text-lg font-semibold text-gray-200 mt-4">{card.title}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">{popupContent.title}</h2>

            {popupContent.title === "List of Pending Requests" && (
              loading ? <p className="text-center">Loading...</p> :
              pendingRequests.length === 0 ? <p className="text-center">No pending requests.</p> :
              pendingRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-3">
                  <span className="text-gray-800 font-semibold">{request.sender.username}</span>
                  <div className="space-x-2">
                    <button onClick={() => handleAcceptRequest(request.sender.username)} className="bg-green-500 text-white px-3 py-1 rounded-md">Accept</button>
                    <button onClick={() => handleRejectRequest(request.sender.username)} className="bg-gray-500 text-white px-3 py-1 rounded-md">Reject</button>
                    <button onClick={() => handleBlockRequest(request.sender.username)} className="bg-red-500 text-white px-3 py-1 rounded-md">Block</button>
                  </div>
                </div>
              ))
            )}

            {popupContent.title === "Blocked Users" && (
              loading ? <p className="text-center">Loading...</p> :
              blockedUsers.length === 0 ? <p className="text-center">No blocked users.</p> :
              blockedUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-3">
                  <span className="text-gray-800 font-semibold">{user.username}</span>
                  <button onClick={() => handleUnblockUser(user.username)} className="bg-blue-500 text-white px-3 py-1 rounded-md">Unblock</button>
                </div>
              ))
            )}

            <button onClick={closePopup} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

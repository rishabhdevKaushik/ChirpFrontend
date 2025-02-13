import React, { useState } from "react";
import { FaUserPlus, FaUserEdit, FaBan } from "react-icons/fa";
import { apiEndpoints } from "../Api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [popupContent, setPopupContent] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Get username from localStorage
    const username = localStorage.getItem('currentUsername');

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
            setBlockedUsers(
                blockedUsers.filter((user) => user.username !== username)
            );
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
        setLoading(false);
    };

    // Accept friend request
    const handleAcceptRequest = async (username) => {
        setLoading(true);
        try {
            await apiEndpoints.updateFriendRequest(
                { status: "ACCEPT" },
                username
            );
            fetchPendingRequests();
        } catch (error) {
            console.error("Error accepting user:", error);
            setLoading(false);
        } finally {
            fetchPendingRequests();
        }

        // Make new chat with this person
        try {
            const data = { username };

            await apiEndpoints.accessChat(data);
        } catch (error) {
            console.error("Error making chat with this user:", error);
        }
    };

    // Reject friend request
    const handleRejectRequest = async (username) => {
        setLoading(true);
        try {
            await apiEndpoints.updateFriendRequest(
                { status: "REJECT" },
                username
            );
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
        {
            title: "List of Pending Requests",
            icon: <FaUserPlus className="text-green-500 text-3xl" />,
        },
        {
            title: "Blocked Users",
            icon: <FaBan className="text-red-500 text-3xl" />,
        },
        {
            title: "User Updates",
            icon: <FaUserEdit className="text-yellow-500 text-3xl" />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            {/* Welcome Message */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Hi, {username}! 👋
                </h1>
                <p className="text-gray-600 mt-2">Welcome to your profile</p>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {cardsData.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            onClick={() => handleCardClick(card)}
                        >
                            <div className="flex justify-center mb-4">
                                {card.icon}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-700">
                                {card.title}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup Modal */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                                {popupContent.title}
                            </h2>

                            {popupContent.title === "List of Pending Requests" &&
                                (loading ? (
                                    <p className="text-center">Loading...</p>
                                ) : pendingRequests.length === 0 ? (
                                    <p className="text-center text-gray-600">
                                        No pending requests.
                                    </p>
                                ) : (
                                    pendingRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-3"
                                        >
                                            <span className="text-gray-800 font-semibold">
                                                {request.sender.username}
                                            </span>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => handleAcceptRequest(request.sender.username)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(request.sender.username)}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleBlockRequest(request.sender.username)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Block
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ))}

                            {popupContent.title === "Blocked Users" &&
                                (loading ? (
                                    <p className="text-center">Loading...</p>
                                ) : blockedUsers.length === 0 ? (
                                    <p className="text-center text-gray-600">
                                        No blocked users.
                                    </p>
                                ) : (
                                    blockedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-3"
                                        >
                                            <span className="text-gray-800 font-semibold">
                                                {user.username}
                                            </span>
                                            <button
                                                onClick={() => handleUnblockUser(user.username)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                    ))
                                ))}

                            <button
                                onClick={closePopup}
                                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

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
    const username = localStorage.getItem("currentUsername");

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
        if (card.title === "Pending Requests") fetchPendingRequests();
        if (card.title === "Blocked Users") fetchBlockedUsers();
        if (card.title === "Update User") navigate("/updateprofile");
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const cardsData = [
        {
            title: "Pending Requests",
            icon: <FaUserPlus className="text-green-500 text-3xl" />,
        },
        {
            title: "Blocked Users",
            icon: <FaBan className="text-red-500 text-3xl" />,
        },
        {
            title: "Update User",
            icon: <FaUserEdit className="text-yellow-500 text-3xl" />,
        },
    ];

    return (
        <div className="relative bg-dark-background h-[90dvh] flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Enhanced Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Welcome Message */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                        Hi, {username}!
                    </h1>
                    <p className="text-secondary mt-2">
                        Welcome to your profile
                    </p>
                </div>
                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    {/* Cards */}
                    <div className="flex flex-col space-y-4 sm:space-y-6">
                        {cardsData.map((card, index) => (
                            <div
                                key={index}
                                    className="bg-surface shadow-lg rounded-xl p-3 sm:p-4 text-left cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-primary/20"
                                onClick={() => handleCardClick(card)}
                            >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-xl sm:text-2xl">
                                    {card.icon}
                                </div>
                                        <h2 className="text-sm sm:text-base font-semibold text-primary">
                                    {card.title}
                                </h2>
                            </div>
                                </div>
                        ))}
                    </div>
                </div>

                {/* Popup Modal */}
                {isPopupOpen && (
                    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-surface rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md border border-primary/20">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-xl font-bold text-primary text-center mb-4">
                                    {popupContent.title}
                                </h2>
                                {popupContent.title ===
                                    "Pending Requests" &&
                                    (loading ? (
                                        <p className="text-center text-muted">
                                            Loading...
                                        </p>
                                    ) : pendingRequests.length === 0 ? (
                                        <p className="text-center text-muted">
                                            No pending requests.
                                        </p>
                                    ) : (
                                        pendingRequests.map((request) => (
                                            <div
                                                key={request.id}
                                                className="flex justify-between items-center bg-surface p-3 rounded-lg mb-3 border border-primary/20"
                                            >
                                                <span className="text-primary font-semibold">
                                                    {request.sender.username}
                                                </span>
                                                <div className="space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAcceptRequest(
                                                                request.sender
                                                                    .username
                                                            )
                                                        }
                                                        className="bg-primary hover:bg-primary-dark text-primary py-1.5 px-3 rounded-md transition-colors duration-300"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRejectRequest(
                                                                request.sender
                                                                    .username
                                                            )
                                                        }
                                                        className="bg-surface hover:bg-surface/80 text-primary py-1.5 px-3 rounded-md transition-colors duration-300 border border-primary/20"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleBlockRequest(
                                                                request.sender
                                                                    .username
                                                            )
                                                        }
                                                        className="bg-primary hover:bg-primary-dark text-primary py-1.5 px-3 rounded-md transition-colors duration-300"
                                                    >
                                                        Block
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ))}
                                {popupContent.title === "Blocked Users" &&
                                    (loading ? (
                                        <p className="text-center text-muted">
                                            Loading...
                                        </p>
                                    ) : blockedUsers.length === 0 ? (
                                        <p className="text-center text-muted">
                                            No blocked users.
                                        </p>
                                    ) : (
                                        blockedUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex justify-between items-center bg-surface p-3 rounded-lg mb-3 border border-primary/20"
                                            >
                                                <span className="text-primary font-semibold">
                                                    {user.username}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleUnblockUser(
                                                            user.username
                                                        )
                                                    }
                                                    className="bg-primary hover:bg-primary-dark text-primary py-1.5 px-3 rounded-md transition-colors duration-300"
                                                >
                                                    Unblock
                                                </button>
                                            </div>
                                        ))
                                    ))}
                                <button
                                    onClick={closePopup}
                                    className="mt-4 w-full bg-primary hover:bg-primary-dark text-primary py-2 px-4 rounded-md transition-colors duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

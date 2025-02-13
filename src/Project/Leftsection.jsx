import React, { useState, useEffect } from "react";
import { apiEndpoints } from "../Api"; // Ensure this path and file export are correct
import SendRequest from "./Sendrequest"; // Import the SendRequest component
import socket from "../socket";

const LeftSection = ({ onSelectFriend }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);
    const [globalSearchResult, setGlobalSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSendRequest, setShowSendRequest] = useState(false);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Fetch friends from backend
        const fetchFriends = async () => {
            try {
                const currentUsername = localStorage.getItem("currentUsername");

                const response = await apiEndpoints.fetchChat();

                // Assuming 'currentUser' data is available in the response
                // Initialize an array to hold the friends
                const fetchedFriends = [];

                // Iterate through each chat object in the response
                response.data.forEach((chat) => {
                    if (chat.isGroup) {
                        // If it's a group chat, add the chatName to the friends list
                        fetchedFriends.push({
                            id: chat._id, // Use the chat ID as a unique identifier
                            name: chat.chatName,
                            isGroup: true,
                        });
                    } else {
                        // If it's not a group chat, filter out the current user and add the other user
                        chat.users.forEach((user) => {
                            if (user.username !== currentUsername) {
                                fetchedFriends.push({
                                    id: chat._id,
                                    name: user.username,
                                    isGroup: false,
                                });
                            }
                        });
                    }
                });

                // Merge friends while avoiding duplicates
                setFriends((prevFriends) => {
                    const uniqueFriends = [
                        ...prevFriends,
                        ...fetchedFriends,
                    ].reduce((acc, friend) => {
                        if (
                            !acc.some((existing) => existing.id === friend.id)
                        ) {
                            acc.push(friend);
                        }
                        return acc;
                    }, []);
                    return uniqueFriends;
                });
            } catch (err) {
                setError("Failed to fetch friends list.");
            }
        };

        fetchFriends();
    }, []);

    const filteredFriends = isGlobalSearch
        ? []
        : friends.filter((friend) =>
              friend.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (isGlobalSearch && query.trim()) {
            setLoading(true);
            setError(null);
            setGlobalSearchResult(null);

            try {
                const response = await apiEndpoints.findUser(query); // API call to find user
                setGlobalSearchResult(response.data.user || null);
            } catch (err) {
                setError("Failed to search globally. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCheckboxChange = () => {
        setIsGlobalSearch((prev) => !prev);
        setGlobalSearchResult(null);
        setSearchQuery("");
    };

    const handleSelectChat = (chat) => {
        localStorage.setItem("selectedChat", chat);
        localStorage.setItem("selectedChatId", chat.id);
        // Join the chat room when a friend is selected
        socket.emit("join chat", chat.id);

        onSelectFriend(chat);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center p-4 md:p-6">
            <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg border border-gray-100">
                {/* Search Section */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={isGlobalSearch ? "Search globally..." : "Search friends..."}
                        className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-gray-50"
                    />
                    <div className="flex items-center mt-3">
                        <input
                            type="checkbox"
                            checked={isGlobalSearch}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-blue-500 rounded focus:ring-blue-400"
                        />
                        <label className="ml-2 text-gray-600 text-sm font-medium">Search Globally</label>
                    </div>
                </div>

                {isGlobalSearch && (
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Global Search Results
                    </h3>
                )}

                <div className="space-y-3">
                    {!isGlobalSearch ? (
                        filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <div
                                    key={friend.name}
                                    className="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer"
                                    onClick={() => handleSelectChat(friend)}
                                >
                                    <div className="flex items-center space-x-4 w-full">
                                        <div className="relative">
                                            <img
                                                src={friend.avatar || "https://i.pravatar.cc/150?img=2"}
                                                alt={friend.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                            />
                                            {friend.isGroup && (
                                                <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{friend.name}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No friends found</p>
                        )
                    ) : loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : globalSearchResult ? (
                        <div
                            className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer"
                            onClick={() => setShowSendRequest(true)}
                        >
                            <div className="flex flex-col space-y-2">
                                <h4 className="font-semibold text-gray-800">{globalSearchResult.name}</h4>
                                <p className="text-sm text-gray-600">@{globalSearchResult.username}</p>
                                <p className="text-sm text-gray-600">{globalSearchResult.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            {error || (searchQuery ? "No user found" : "")}
                        </p>
                    )}
                </div>
            </div>

            {showSendRequest && <SendRequest username={globalSearchResult.username} />}
        </div>
    );
};

export default LeftSection;

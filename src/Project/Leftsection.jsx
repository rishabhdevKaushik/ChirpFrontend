import React, { useState, useEffect } from "react";
import { apiEndpoints } from "../Api"; // Ensure this path and file export are correct
import SendRequest from "./Sendrequest"; // Import the SendRequest component
import socket from "../socket";

const LeftSection = ({ onSelectChat, isMobile }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);
    const [globalSearchResult, setGlobalSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSendRequest, setShowSendRequest] = useState(false);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Fetch chats from backend
        const fetchChats = async () => {
            try {
                const currentUsername = localStorage.getItem("currentUsername");

                const response = await apiEndpoints.fetchChat();

                // Assuming 'currentUser' data is available in the response
                // Initialize an array to hold the chats
                const fetchedChats = [];

                // Iterate through each chat object in the response
                response.data.forEach((chat) => {
                    if (chat.isGroup) {
                        // If it's a group chat, add the chatName to the chats list
                        fetchedChats.push({
                            id: chat._id, // Use the chat ID as a unique identifier
                            name: chat.chatName,
                            isGroup: true,
                        });
                    } else {
                        // If it's not a group chat, filter out the current user and add the other user
                        chat.users.forEach((user) => {
                            if (user.username !== currentUsername) {
                                fetchedChats.push({
                                    id: chat._id,
                                    name: user.username,
                                    isGroup: false,
                                });
                            }
                        });
                    }
                });

                // Merge chats while avoiding duplicates
                setChats((prevChats) => {
                    const uniqueChats = [...prevChats, ...fetchedChats].reduce(
                        (acc, chat) => {
                            if (
                                !acc.some((existing) => existing.id === chat.id)
                            ) {
                                acc.push(chat);
                            }
                            return acc;
                        },
                        []
                    );
                    return uniqueChats;
                });
            } catch (err) {
                setError("Failed to fetch chats list.");
            }
        };

        fetchChats();
    }, []);

    const filteredChats = isGlobalSearch
        ? []
        : chats.filter((chat) =>
              chat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        // Join the chat room when a chat is selected
        socket.emit("join chat", chat.id);

        onSelectChat(chat);
    };

    return (
        <div
            className={`flex flex-col h-full ${isMobile ? "rounded-none" : ""}`}
        >
            <div
                className={`bg-white shadow-xl ${
                    isMobile ? "rounded-none" : "rounded-xl"
                } p-4 w-full border border-gray-100 flex flex-col h-full`}
            >
                {/* Search Section */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={
                            isGlobalSearch
                                ? "Search globally..."
                                : "Search chats..."
                        }
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-gray-50"
                    />
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={isGlobalSearch}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-blue-500 rounded focus:ring-blue-400"
                        />
                        <label className="ml-2 text-gray-600 text-sm font-medium">
                            Search Globally
                        </label>
                    </div>
                </div>

                {isGlobalSearch && (
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Global Search Results
                    </h3>
                )}

                {/* Chats List */}
                <div className="flex-grow overflow-y-auto">
                    <div className="flex flex-col gap-3">
                        {!isGlobalSearch ? (
                            filteredChats.length > 0 ? (
                                filteredChats.map((chat) => (
                                    <div
                                        key={chat.name}
                                        className="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer"
                                        onClick={() => handleSelectChat(chat)}
                                    >
                                        <div className="flex items-center p-3">
                                            <div className="relative">
                                                {chat.avatar ? (
                                                    <img
                                                        src={chat.avatar}
                                                        alt={chat.name}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-bold border-2 border-gray-100">
                                                        {chat.name
                                                            ? chat.name
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : "?"}
                                                    </div>
                                                )}

                                                {chat.isGroup && (
                                                    <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                                        <svg
                                                            className="w-3 h-3 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    {chat.name}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No chats found
                                </p>
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
                                    <h4 className="font-semibold text-gray-800">
                                        {globalSearchResult.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        @{globalSearchResult.username}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {globalSearchResult.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                {error || (searchQuery ? "No user found" : "")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {showSendRequest && (
                <SendRequest username={globalSearchResult.username} />
            )}
        </div>
    );
};

export default LeftSection;

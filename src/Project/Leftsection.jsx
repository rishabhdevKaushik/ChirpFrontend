import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

import { apiEndpoints } from "../Api";
import AddNew from "./AddNew";
import socket from "../socket";
import "../styles/scrollbar.css";

const LeftSection = ({ onSelectChat, isMobile }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddNewPopup, setShowAddNewPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [chats, setChats] = useState([]);
    // const navigate = useNavigate();

    useEffect(() => {
        // Fetch chats from backend
        const fetchChats = async () => {
            try {
                setLoading(true);
                const currentUsername = localStorage.getItem("currentUsername");

                const response = await apiEndpoints.fetchChat();
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
                console.error("Failed to fetch chats list.", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
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
            className={`flex flex-col ${
                isMobile
                    ? "p-0 rounded-none fixed inset-0"
                    : "p-4 rounded-xl h-full"
            } bg-background shadow-lg w-full`}
        >
            <div className="flex flex-col h-full">
                {/* Search Section */}
                <div className="relative mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search chats using username"
                        className="w-full p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-surface text-primary placeholder-text-muted"
                    />
                    <button
                        onClick={() => setShowAddNewPopup(true)}
                        className="p-3 rounded-lg border border-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 bg-surface text-primary"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>
                {/* Chats List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-3">
                        {!loading ? (
                            filteredChats.length > 0 ? (
                                filteredChats.map((chat) => (
                                    <div
                                        key={chat.name}
                                        className="bg-surface rounded-xl border border-gray-700 hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer"
                                        onClick={() => handleSelectChat(chat)}
                                    >
                                        <div className="flex items-center p-3">
                                            <div className="relative">
                                                {chat.avatar ? (
                                                    <img
                                                        src={chat.avatar}
                                                        alt={chat.name}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-700"
                                                    />
                                                ) : chat.isGroup ? (
                                                    <div className=" w-10 h-10 sm:w-12 sm:h-12 bg-surface flex items-center justify-center rounded-full object-cover border-2 border-gray-700">
                                                        <svg
                                                            className="w-6 h-6 text-primary "
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.5"
                                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-surface text-primary font-bold border-2 border-gray-700">
                                                        {chat.name
                                                            ? chat.name
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : "?"}
                                                    </div>
                                                )}

                                                {/* {chat.isGroup && (
                                                    <span className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                                                        <svg
                                                            className="w-3 h-3 text-primary"
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
                                                )} */}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-semibold text-primary text-sm sm:text-base">
                                                    {chat.name}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-4">
                                    No chats found
                                </p>
                            )
                        ) : (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                    </div>
                    {showAddNewPopup && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="relative w-full max-w-md mx-auto">
                                <AddNew
                                    onClose={() => setShowAddNewPopup(false)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeftSection;

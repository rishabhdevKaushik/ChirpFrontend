import React, { useState, useRef, useEffect } from "react";
import { apiEndpoints } from "../Api";
import socket from "../socket.js";

const RightSection = ({ selectedChat, onBackClick, isMobile }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedMsg, setSelectedMsg] = useState(null); // Tracks the selected message for popup
    const [editingMessage, setEditingMessage] = useState(null);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    const currentUsername = localStorage.getItem("currentUsername");
    const currentUserId = localStorage.getItem("currentUserId");
    const selectedChatId = localStorage.getItem("selectedChatId");

    useEffect(() => {
        // Connect socket if not already connected
        if (!socket.connected) {
            socket.connect();
        }

        // Setup user and join chat
        if (currentUserId) {
            console.log(currentUserId);
            socket.emit("setup", currentUserId);
            console.log("sent user id");
        }

        // Join chat room if there's a selected chat
        if (selectedChatId) {
            socket.emit("join chat", selectedChatId);
            console.log("sent chat id");
        }

        // Socket event listeners
        socket.on("connected", () => {
            console.log("Connected to socket io server");
        });

        socket.on("typing", () => {
            setTyping(true);
        });

        socket.on("stopTyping", () => {
            setTyping(false);
        });

        socket.on("messageReceived", (msg) => {
            console.log("Message received:", msg);
            if (msg.chat._id === selectedChatId) {
                setMessages((prevMessages) => {
                    if (prevMessages.find((message) => message._id === msg._id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, msg];
                });
            }
        });

        // Cleanup function
        return () => {
            socket.off("connected");
            socket.off("messageReceived");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [currentUserId, selectedChatId]);

    // Handle socket disconnection on component unmount
    useEffect(() => {
        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, []);

    let typingTimeout;
    const handleChange = (e) => {
        setMessage(e.target.value);

        // Typing indicator
        socket.emit("typing", selectedChatId);

        // Clear the previous timeout if the user keeps typing
        clearTimeout(typingTimeout);

        // Set a new timeout to emit "stopTyping"
        typingTimeout = setTimeout(() => {
            socket.emit("stopTyping", selectedChatId);
        }, 2000); // Emit after 2 seconds of no typing
    };

    useEffect(() => {
        if (message === "" && messageInputRef.current) {
            requestAnimationFrame(() => {
                messageInputRef.current.focus();
            });
        }
    }, [message]);
    
    const handleSend = async (e) => {
        e.preventDefault();
        if (message.trim()) {
            if (editingMessage) {
                try {
                    const data = {
                        messageId: editingMessage._id,
                        content: message,
                    };
    
                    await apiEndpoints.editMessage(data);
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg._id === editingMessage._id
                                ? { ...msg, content: message }
                                : msg
                        )
                    );
                    setEditingMessage(null);
                    setMessage("");  // Triggers useEffect for refocusing
                } catch (error) {
                    console.error("Error editing message:", error);
                }
            } else {
                const tempMessage = {
                    tempId: Date.now(),
                    content: message,
                    sender: { username: currentUsername },
                };
    
                try {
                    setMessages((prev) => [...prev, tempMessage]);
                    setMessage(""); // Triggers useEffect for refocusing
    
                    const response = await apiEndpoints.sendMessage({
                        content: message,
                        chatId: selectedChat.id,
                    });
    
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.tempId === tempMessage.tempId
                                ? { ...response.data, sender: msg.sender }
                                : msg
                        )
                    );
                } catch (error) {
                    console.error("Failed to send message:", error);
                    setMessages((prev) =>
                        prev.filter((msg) => msg.tempId !== tempMessage.tempId)
                    );
                }
            }
        }
    };
    
    

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const getMessages = async (chatId) => {
        try {
            const response = await apiEndpoints.getAllMessagesOfChat(chatId);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        if (selectedChat) {
            getMessages(selectedChat.id);
        }
    }, [selectedChat]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop =
                messagesEndRef.current.scrollHeight;
        }
    }, [messages, typing]);

    const handleDoubleClick = (msg) => {
        setSelectedMsg(msg);
    };

    const handleEdit = async () => {
        setEditingMessage(selectedMsg);
        setMessage(selectedMsg.content);
        setSelectedMsg(null);
    };

    const handleDelete = async () => {
        try {
            await apiEndpoints.deleteMessage(selectedMsg._id);
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg._id !== selectedMsg._id)
            );
        } catch (error) {
            console.error("Error while deleting message:", error);
        }
        setSelectedMsg(null);
    };

    const handleSelect = () => {
        setSelectedMsg(null);
    };

    return (
        <div
            className={`flex flex-col ${
                isMobile ? "h-screen p-0" : "p-4"
            } bg-gradient-to-br from-gray-50 to-gray-100 ${
                isMobile ? "rounded-none" : "rounded-xl"
            } shadow-lg h-full w-full`}
        >
            {selectedChat ? (
                <>
                    <div
                        className={`flex items-center space-x-4 ${
                            isMobile ? "mb-2" : "mb-4"
                        } p-3 bg-white/90 backdrop-blur-sm shadow-md ${
                            isMobile ? "rounded-none" : "rounded-xl"
                        } hover:bg-white/95 transition duration-300 ease-in-out border border-gray-100`}
                    >
                        {isMobile && (
                            <button
                                onClick={onBackClick}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                        )}
                        {selectedChat.avatar ? (
                            <img
                                src={selectedChat.avatar}
                                alt={selectedChat.name}
                                className="w-14 h-14 rounded-full border-2 border-blue-400 p-0.5 hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-bold border-2 border-gray-100">
                                {selectedChat.name
                                    ? selectedChat.name.charAt(0).toUpperCase()
                                    : "?"}
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                                {selectedChat.name}
                            </h3>
                        </div>
                    </div>

                    {/* Messages Display */}
                    <div
                        ref={messagesEndRef}
                        className={`flex-grow overflow-y-auto bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md flex flex-col space-y-3 mb-4 ${
                            isMobile ? "mb-24" : ""
                        }`}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg._id || msg.tempId}
                                onDoubleClick={() => handleDoubleClick(msg)}
                                className={`group p-4 rounded-xl mb-2 shadow-sm max-w-sm break-words transition-all duration-300 hover:-translate-y-0.5 ${
                                    msg.sender.username === currentUsername
                                        ? "self-end bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                        : "self-start bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                                } ${
                                    editingMessage?._id === msg._id
                                        ? "ring-2 ring-yellow-400"
                                        : ""
                                }`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs opacity-70 mb-1">
                                        {msg.sender.username}
                                    </span>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="group p-4 rounded-xl mb-2 shadow-sm max-w-sm break-words transition-all duration-300 hover:-translate-y-0.5 self-start bg-gradient-to-r from-gray-100 to-gray-200">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Popup for Message Options */}
                    {selectedMsg && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                            <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
                                <h3 className="text-lg font-bold text-gray-700">
                                    Message Actions
                                </h3>
                                {selectedMsg.sender.username === currentUsername ? (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-gray-500">
                                        You can only edit or delete your own messages.
                                    </p>
                                )}
                                <button
                                    onClick={handleSelect}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
                                >
                                    Select
                                </button>
                                <button
                                    onClick={() => setSelectedMsg(null)}
                                    className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message Input */}
                    <div
                        className={`${
                            isMobile
                                ? "sticky bottom-0 bg-white/90 p-3"
                                : "flex items-center space-x-3"
                        }`}
                    >
                        <div className="relative w-full">
                            <textarea
                                ref={messageInputRef}
                                value={message}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    editingMessage
                                        ? "Editing message..."
                                        : "Type your message here..."
                                }
                                className="w-full p-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[38px] pr-24 bg-white/90 backdrop-blur-sm transition-all duration-300"
                                rows="1"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                                {editingMessage && (
                                    <button
                                        onClick={() => {
                                            setEditingMessage(null);
                                            setMessage("");
                                        }}
                                        className="bg-gray-500 text-white py-1.5 px-3 rounded-xl shadow-md hover:bg-gray-600 transition-colors duration-300"
                                    >
                                        ✕
                                    </button>
                                )}
                                <button
                                    onClick={handleSend}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1.5 px-4 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {editingMessage ? "Edit" : "Send"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">
                        Select a chat to start chatting
                    </p>
                </div>
            )}
        </div>
    );
};

export default RightSection;

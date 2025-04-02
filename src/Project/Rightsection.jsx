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
            socket.emit("setup", currentUserId);
        }

        // Join chat room if there's a selected chat
        if (selectedChatId) {
            socket.emit("join chat", selectedChatId);
        }

        // Socket event listeners
        socket.on("connected", () => {
        });

        socket.on("typing", () => {
            setTyping(true);
        });

        socket.on("stopTyping", () => {
            setTyping(false);
        });

        socket.on("messageReceived", (msg) => {
            if (msg.chat._id === selectedChatId) {
                setMessages((prevMessages) => {
                    if (
                        prevMessages.find((message) => message._id === msg._id)
                    ) {
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

    const handleSend = async () => {
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
                    setMessage(""); // Triggers useEffect for refocusing
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
            handleSend();
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

    return (
        <div
            className={`flex flex-col ${
                isMobile ? "h-screen p-0" : "p-4"
            } bg-surface ${
                isMobile ? "rounded-none" : "rounded-xl"
            } shadow-lg h-full w-full`}
        >
            {selectedChat ? (
                <>
                    <div
                        className={`flex items-center space-x-4 ${
                            isMobile ? "mb-2" : "mb-4"
                        } p-3 bg-surface backdrop-blur-sm shadow-md ${
                            isMobile ? "rounded-none" : "rounded-xl"
                        } hover:bg-surface/95 transition duration-300 ease-in-out border border-gray-700`}
                    >
                        {isMobile && (
                            <button
                                onClick={onBackClick}
                                className="p-2 hover:bg-surface rounded-full transition-colors duration-300"
                            >
                                <svg
                                    className="w-6 h-6 text-secondary"
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
                                className="w-14 h-14 rounded-full border-2 border-primary p-0.5 hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-surface text-primary font-bold border-2 border-gray-700">
                                {selectedChat.name
                                    ? selectedChat.name.charAt(0).toUpperCase()
                                    : "?"}
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-semibold text-primary hover:text-primary transition-colors duration-300">
                                {selectedChat.name}
                            </h3>
                        </div>
                    </div>

                    {/* Messages Display */}
                    <div
                        ref={messagesEndRef}
                        className={`flex-grow overflow-y-auto bg-surface backdrop-blur-sm p-4 rounded-xl shadow-md flex flex-col space-y-3 mb-4 ${
                            isMobile ? "mb-24" : ""
                        }`}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg._id || msg.tempId}
                                onDoubleClick={() => handleDoubleClick(msg)}
                                className={`group p-4 rounded-xl mb-2 shadow-sm max-w-sm break-words transition-all duration-300 hover:-translate-y-0.5 ${
                                    msg.sender.username === currentUsername
                                        ? "self-end bg-primary text-primary"
                                        : "self-start bg-surface border border-gray-700 text-primary"
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
                            <div className="group p-4 rounded-xl mb-2 shadow-sm max-w-sm break-words transition-all duration-300 hover:-translate-y-0.5 self-start bg-surface border border-gray-700">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Popup for Message Options */}
                    {selectedMsg && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                            <div className="bg-surface p-6 rounded-lg shadow-xl space-y-4 border border-gray-700">
                                <h3 className="text-lg font-bold text-primary">
                                    Message Actions
                                </h3>
                                {selectedMsg.sender.username ===
                                currentUsername ? (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="w-full bg-primary text-primary py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full bg-red-500 text-primary py-2 px-4 rounded-lg shadow-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-muted">
                                        You can only edit or delete your own
                                        messages.
                                    </p>
                                )}
                                <button
                                    onClick={() => setSelectedMsg(null)}
                                    className="w-full bg-surface text-primary py-2 px-4 rounded-lg shadow-md hover:bg-surface border border-gray-700"
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
                                ? "sticky bottom-0 bg-surface/90 p-3"
                                : "flex items-center space-x-3"
                        }`}
                    >
                        <div className="relative w-full flex items-center">
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
                                className="w-full p-2 rounded-xl border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[38px] pr-24 bg-surface text-primary placeholder-text-muted transition-all duration-300 flex items-center"
                                rows="1"
                            />
                            <div className="absolute right-2 top-0 bottom-0 flex items-center gap-2">
                                {editingMessage && (
                                    <button
                                        onClick={() => {
                                            setEditingMessage(null);
                                            setMessage("");
                                        }}
                                        className="bg-surface text-primary py-1.5 px-3 rounded-xl shadow-md hover:bg-surface/80 transition-colors duration-300 border border-gray-700"
                                    >
                                        ✕
                                    </button>
                                )}
                                <button
                                    onClick={handleSend}
                                    className="bg-primary text-primary py-1.5 px-4 rounded-xl shadow-md hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {editingMessage ? "Edit" : "Send"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border border-gray-700">
                        <svg
                            className="w-10 h-10 text-primary"
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
                    <p className="text-muted text-lg">
                        Select a chat to start chatting
                    </p>
                </div>
            )}
        </div>
    );
};

export default RightSection;

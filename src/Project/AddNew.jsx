import React, { useState } from "react";
import { apiEndpoints } from "../Api";
const AddNew = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // For add new friend
    const [addUserModal, setAddUserModal] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");
    const [foundUser, setFoundUser] = useState(null);

    // For create group
    const [groupName, setGroupName] = useState("");
    const [createGroupModal, setCreateGroupModal] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friends, setFriends] = useState([]);

    const handleAddFriend = async () => {
        setAddUserModal(true);
    };

    const handleUsernameSubmit = async () => {
        if (usernameInput) {
            try {
                setLoading(true);
                setError(null);
                const response = await apiEndpoints.findUser(usernameInput);
                setFoundUser(response.data.user); // Store the found user data
            } catch (error) {
                setError(error.response?.data?.message || "Error finding user");
                // console.error("Error finding user:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiEndpoints.sendFriendRequest(foundUser.username);
            if (response.status === 201) {
                setSuccessMessage(`Friend request sent to ${foundUser.username}!`);
            }else {
                setSuccessMessage(`${response.data.message}`);

            }
            setTimeout(() => {
                // setSuccessMessage(null);
                onClose();
            }, 2000);
            setFoundUser(null);
            setUsernameInput("");
        } catch (error) {
            setError(
                error.response?.data?.message || "Error Sending friend request"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await apiEndpoints.listFriends();
            setFriends(response.data.friends);
        } catch (error) {
            console.error("Error fetching friends:", error);
            setError("Failed to fetch friends list");
        }
    };

    const handleCreateGroup = async () => {
        setCreateGroupModal(true);
        fetchFriends();
    };

    const handleGroupSubmit = async () => {
        if (!groupName.trim()) {
            setError("Group name is required");
            return;
        }
        if (selectedFriends.length < 2) {
            setError("Please select at least 2 friends");
            return;
        }
        try {
            setLoading(true);
            await apiEndpoints.createGroupchat({
                name: groupName,
                usernames: selectedFriends.map((friend) => friend.username),
            });
            setSuccessMessage("Group created successfully!");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    const toggleFriendSelection = (friend) => {
        setError(null);
        setSuccessMessage(null);
        setSelectedFriends((prev) =>
            prev.find((f) => f.username === friend.username)
                ? prev.filter((f) => f.username !== friend.username)
                : [...prev, friend]
        );
    };

    return (
        <div className="relative w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-surface text-primary hover:text-onPrimary transition-all duration-300"
                aria-label="Close"
            >
                ⨉
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-6 sm:mb-8">
                Add New
            </h1>
            <div className="space-y-4">
                {/* Add Friend Option */}
                <button
                    onClick={handleAddFriend}
                    className="w-full p-4 rounded-xl border border-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 bg-surface text-primary flex items-center justify-between"
                >
                    <span className="text-lg">Add Friend</span>
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
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>
                </button>

                {/* Create Group Option */}
                <button
                    onClick={handleCreateGroup}
                    className="w-full p-4 rounded-xl border border-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 bg-surface text-primary flex items-center justify-between"
                >
                    <span className="text-lg">Create Group</span>
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </button>

                {/* Add Friend Modal */}
                {addUserModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="relative w-full max-w-md mx-auto bg-surface rounded-2xl shadow-2xl p-6">
                            <h2 className="text-xl font-semibold text-primary mb-4">
                                Add Friend
                            </h2>
                            <div>
                                {successMessage && (
                                    <div
                                        className="mb-4 p-3 rounded-lg border border-secondary text-secondary text-sm text-center bg-secondary/10"
                                        role="alert"
                                    >
                                        {successMessage}
                                    </div>
                                )}
                            </div>
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                    <p className="text-red-400 text-sm text-center">
                                        {error}
                                    </p>
                                </div>
                            )}
                            {foundUser ? (
                                <div className="flex flex-col gap-3">
                                    <div className="p-3 bg-surface/80 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            {foundUser.avatarUrl ? (
                                                <img
                                                    src={foundUser.avatarUrl}
                                                    alt={foundUser.username}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background text-primary font-bold border border-gray-700">
                                                    {foundUser.username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-primary font-semibold">
                                                    {foundUser.name}
                                                </p>
                                                <p className="text-muted text-sm">
                                                    @{foundUser.username}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setFoundUser(null);
                                                setError(null);
                                            }}
                                            className="px-4 py-2 rounded-xl border border-gray-700 text-primary hover:bg-surface/80"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendFriendRequest}
                                            className="px-4 py-2 rounded-xl bg-primary text-primary hover:bg-primary-dark"
                                        >
                                            {loading
                                                ? "Sending..."
                                                : "Send Friend Request"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        value={usernameInput}
                                        onChange={(e) => {
                                            setUsernameInput(e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="Enter username"
                                        className="w-full p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-primary mb-4"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setAddUserModal(false);
                                                setUsernameInput("");
                                                setError(null);
                                            }}
                                            className="px-4 py-2 rounded-xl border border-gray-700 text-primary hover:bg-surface/80"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUsernameSubmit}
                                            disabled={loading}
                                            className="px-4 py-2 rounded-xl bg-primary text-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading
                                                ? "Searching..."
                                                : "Search"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Create Group Modal */}
                {createGroupModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="relative w-full max-w-md mx-auto bg-surface rounded-2xl shadow-2xl p-6">
                            {/* Minimize Button */}
                            <button
                                onClick={() => setCreateGroupModal(false)}
                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-surface text-primary hover:text-onPrimary transition-all duration-300"
                                aria-label="Minimize"
                            >
                                —
                            </button>
                            <h2 className="text-xl font-semibold text-primary mb-4">
                                Create Group
                            </h2>
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                    <p className="text-red-400 text-sm text-center">
                                        {error}
                                    </p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="mb-4 p-3 rounded-lg border border-secondary text-secondary text-sm text-center bg-secondary/10">
                                    {successMessage}
                                </div>
                            )}
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => {
                                    setGroupName(e.target.value);
                                    setError(null);
                                    setSuccessMessage(null);
                                }}
                                placeholder="Enter group name"
                                className="w-full p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-primary mb-4"
                            />
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {friends.map((friend) => (
                                    <div
                                        key={friend.username}
                                        className={`flex items-center justify-between p-3  rounded-lg mb-2 border border-gray-700 ${
                                            selectedFriends.find(
                                                (f) =>
                                                    f.username ===
                                                    friend.username
                                            )
                                                ? "bg-primary-dark"
                                                : "bg-surface/80"
                                        }`}
                                        onClick={() =>
                                            toggleFriendSelection(friend)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            {friend.avatarUrl ? (
                                                <img
                                                    src={friend.avatarUrl}
                                                    alt={friend.username}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary font-bold">
                                                    {friend.username[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-primary">
                                                    {friend.name}
                                                </p>
                                                <p className="text-muted text-sm">
                                                    @{friend.username}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setCreateGroupModal(false);
                                        setError(null);
                                        setSuccessMessage(null);
                                        setSelectedFriends([]);
                                        setGroupName("")
                                    }}
                                    className="px-4 py-2 rounded-xl border border-gray-700 text-primary hover:bg-surface/80"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGroupSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-xl bg-primary text-primary hover:bg-primary-dark"
                                >
                                    {loading ? "Creating..." : "Create Group"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AddNew;

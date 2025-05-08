import React, { useState } from "react";
import { apiEndpoints } from "../Api";

const UpdateProfile = () => {
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const updateUser = async (data) => {
        try {
            await apiEndpoints.updateUser(data);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            password,
            newUsername: newUsername || undefined,
            newEmail: newEmail || undefined,
            newName: newName || undefined,
            newPassword: newPassword || undefined,
            confirmNewPassword: confirmNewPassword || undefined,
        };
        updateUser(formData);
    };

    return (
        <div className="relative bg-dark-background h-[90dvh] flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl max-h-[75vh] overflow-y-auto custom-scrollbar">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-6 sm:mb-8">
                    Update Profile
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    {/* Old Password (Required) */}
                    <div className="relative">
                        <div className="relative group inline-block">
                            <label className="block text-primary text-sm font-medium mb-2 cursor-pointer">
                                Password *
                            </label>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                Required
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                                placeholder="Enter old password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-2 flex items-center text-sm text-onPrimary hover:underline"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* New Username */}
                    <div className="relative">
                        <div className="relative group inline-block">
                            <label
                                htmlFor="newUsername"
                                className="block text-primary text-sm font-medium mb-2 cursor-pointer"
                            >
                                New Username
                            </label>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                Optional
                            </div>
                        </div>
                        <input
                            type="text"
                            id="newUsername"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                            placeholder="Enter new username"
                        />
                    </div>

                    {/* New Email */}
                    <div className="relative">
                        <div className="relative group inline-block">
                            <label
                                htmlFor="newEmail"
                                className="block text-primary text-sm font-medium mb-2 cursor-pointer"
                            >
                                New Email
                            </label>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                Optional
                            </div>
                        </div>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                            placeholder="Enter new email"
                        />
                    </div>

                    {/* New Name */}
                    <div className="relative">
                        <div className="relative group inline-block">
                            <label
                                htmlFor="newName"
                                className="block text-primary text-sm font-medium mb-2 cursor-pointer"
                            >
                                New Name
                            </label>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                Optional
                            </div>
                        </div>
                        <input
                            type="text"
                            id="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                            placeholder="Enter new name"
                        />
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <div className="relative group inline-block">
                            <label
                                htmlFor="newPassword"
                                className="block text-primary text-sm font-medium mb-2 cursor-pointer"
                            >
                                New Password
                            </label>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                Optional
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-2 flex items-center text-sm text-onPrimary hover:underline"
                            >
                                {showNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="relative">
                        <div className="relative group inline-block">
                            <label
                                htmlFor="confirmNewPassword"
                                className="block text-primary text-sm font-medium mb-2 cursor-pointer"
                            >
                                Confirm New Password
                            </label>
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                Required if new password is set
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-2 flex items-center text-sm text-onPrimary hover:underline"
                            >
                                {showNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-primary text-primary px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-md hover:bg-primary-dark transition-colors duration-300 transform hover:scale-105 ease-in-out"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;

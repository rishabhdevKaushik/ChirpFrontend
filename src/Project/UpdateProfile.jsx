import React, { useState } from "react";
import { apiEndpoints } from "../Api";
const UpdateProfile = () => {
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const updateFriendRequest = async (data) => {
        try {
            const response = await apiEndpoints.updateUser(data);

            console.log(response);
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

        console.log("form Data:", formData);

        // Call the API function
        updateFriendRequest(formData);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">
                Update Profile
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Old Password */}
                <div className="relative">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="oldPassword"
                    >
                        Old Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300 ease-in-out"
                        placeholder="Enter old password"
                    />
                </div>

                {/* New Username */}
                <div className="relative">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="newUsername"
                    >
                        New Username (Optional)
                    </label>
                    <input
                        type="text"
                        id="newUsername"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300 ease-in-out"
                        placeholder="Enter new username"
                    />
                </div>

                {/* New Email */}
                <div className="relative">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="newEmail"
                    >
                        New Email (Optional)
                    </label>
                    <input
                        type="email"
                        id="newEmail"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300 ease-in-out"
                        placeholder="Enter new email"
                    />
                </div>

                {/* New Name */}
                <div className="relative">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="newName"
                    >
                        New Name (Optional)
                    </label>
                    <input
                        type="text"
                        id="newName"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300 ease-in-out"
                        placeholder="Enter new name"
                    />
                </div>

                {/* New Password */}
                <div className="relative">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="newPassword"
                    >
                        New Password (Optional)
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300 ease-in-out"
                        placeholder="Enter new password"
                    />
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="confirmNewPassword"
                    >
                        Confirm New Password (Optional)
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300 ease-in-out"
                        placeholder="Confirm new password"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 ease-in-out"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const tempUserId = sessionStorage.getItem("tempUserId");
            await apiEndpoints.changePassword({
                newPassword: passwords.newPassword,
                tempUserId,
            });
            navigate("/main");
        } catch (error) {
            console.error("Change password error:", error);
            setError("Failed to change password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-dark-background h-[100dvh] flex items-center justify-center bg-cover bg-center px-4 sm:px-6 overflow-hidden">
            {/* Enhanced Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary bg-clip-text leading-tight animate-fade-in-down">
                        Change Password
                    </h1>
                    
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                        <p className="text-red-400 text-center text-sm">
                            {error}
                        </p>
                    </div>
                )}

                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-primary"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-primary"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg shadow-lg ${
                            loading
                                ? "bg-primary-light cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dark"
                        } text-primary font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Saving Changes...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api"; // Import your API endpoints

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiEndpoints.login(formData);
            const { token, currentUser } = response.data;
            localStorage.setItem("accessToken", token.accessToken);
            localStorage.setItem("refreshToken", token.refreshToken);
            localStorage.setItem("currentUsername", currentUser.username);
            localStorage.setItem("currentUserId", currentUser.id);
            navigate("/main");
        } catch (error) {
            console.error(error);
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = () => {
        navigate("/Signup");
    };

    return (
        <div className="relative bg-dark-background min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Enhanced Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-12 transform transition-all duration-300 hover:shadow-3xl">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary bg-clip-text leading-tight animate-fade-in-down">
                        Welcome Back!
                    </h1>
                    <p className="text-lg sm:text-xl text-primary mt-3 animate-fade-in">
                        Login to your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                        <p className="text-red-400 text-center text-sm">
                            {error}
                        </p>
                    </div>
                )}

                <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label
                            htmlFor="identifier"
                            className="block text-sm font-medium text-primary"
                        >
                            Username or Email
                        </label>
                        <input
                            type="text"
                            name="identifier"
                            id="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Enter your username or email"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-primary"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Enter your password"
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
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs sm:text-sm text-muted">
                        Don't have an account?{" "}
                        <button
                            onClick={handleSignup}
                            className="text-accent font-medium hover:underline duration-300"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

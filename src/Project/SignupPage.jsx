import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../Api";

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        // Clear all localStorage
        localStorage.clear();
        try {
            const response = await apiEndpoints.signup(formData, {
                withCredentials: true,
                credentials: "include",
            });
            sessionStorage.setItem("tempUserId", response.data.tempUserId);
            sessionStorage.setItem("email", formData.email);
            navigate("/Otp");
        } catch (error) {
            // console.error(
            //     "SignUp Error:",
            //     error.response?.data || error.message
            // );
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="relative bg-dark-background h-[100dvh] flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-4xl  sm:text-5xl font-extrabold text-primary bg-clip-text leading-tight animate-fade-in-down">
                        Sign Up
                    </h1>
                    <p className="text-lg sm:text-xl text-primary mt-3 animate-fade-in">
                        Create your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                        <p className="text-red-400 text-center text-sm">
                            {error}
                        </p>
                    </div>
                )}

                <form
                    className="space-y-4 sm:space-y-6"
                    onSubmit={handleSubmit}
                >
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                            placeholder="Your username"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                            placeholder="Your email"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                                placeholder="Your password"
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

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-surface text-primary placeholder-text-muted transition duration-300 ease-in-out"
                                placeholder="Confirm password"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading
                                ? "bg-primary-light cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dark"
                        } text-primary py-2 sm:py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base transition-all duration-300`}
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
                                Signing up...
                            </span>
                        ) : (
                            "Sign up"
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-xs sm:text-sm text-muted">
                        Already have an account?{" "}
                        <button
                            onClick={handleLogin}
                            className="text-accent font-medium hover:underline duration-300"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

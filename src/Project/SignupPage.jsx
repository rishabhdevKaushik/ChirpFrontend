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
        try {
            const response = await apiEndpoints.signup(formData);
            console.log("SignUp Successful:", response.data);
            navigate("/main");
        } catch (error) {
            console.error(
                "SignUp Error:",
                error.response?.data || error.message
            );
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

            <div className="relative z-10 backdrop-blur-md w-full max-w-sm sm:max-w-md lg:max-w-lg bg-gray-900 bg-opacity-70 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text leading-tight animate__animated animate__fadeIn">
                        Sign Up
                    </h1>
                    <p className="text-sm sm:text-base text-gray-300">Create your account</p>
                </div>

                {error && (
                    <p className="text-red-500 text-center mb-2 text-sm sm:text-base animate__animated animate__fadeIn">
                        {error}
                    </p>
                )}

                <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Your username"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Your password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading
                                ? "bg-gray-600"
                                : "bg-gradient-to-r from-blue-500 to-purple-600"
                        } text-white py-2 sm:py-3 rounded-md shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base transition-all duration-300`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-xs sm:text-sm text-gray-400">
                        Already have an account?{" "}
                        <button
                            onClick={handleLogin}
                            className="text-blue-400 hover:underline font-medium"
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

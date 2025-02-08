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
            const { accessToken, currentUser } = response.data;
            localStorage.setItem("accessToken", accessToken);
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
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/bg1.jpeg')" }}
        >
            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

            <div className="relative z-10 backdrop-blur-md w-full max-w-lg bg-gray-900 bg-opacity-70 rounded-lg shadow-xl p-8 sm:p-10 transform transition duration-500 hover:scale-105 hover:shadow-2xl rounded-full">
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text leading-tight animate__animated animate__fadeIn">
                        Welcome Back!
                    </h1>
                    <p className="text-xl text-gray-300">
                        Login to your account
                    </p>
                </div>

                {error && (
                    <p className="text-red-500 text-center mb-4 animate__animated animate__fadeIn">
                        {error}
                    </p>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label
                            htmlFor="identifier"
                            className="block text-sm font-medium text-gray-300"
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
                            className="mt-1 block w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-300 ease-in-out transform hover:scale-105"
                            placeholder="Enter your username or email"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
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
                            className="mt-1 block w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-300 ease-in-out transform hover:scale-105"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading
                                ? "bg-gray-600"
                                : "bg-gradient-to-r from-blue-500 to-purple-600"
                        } text-white py-3 px-4 rounded-md shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <button
                            onClick={handleSignup}
                            className="text-blue-400 hover:underline font-medium"
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

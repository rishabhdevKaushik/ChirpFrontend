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
            await apiEndpoints.signup(formData);
            navigate("/Otp");
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
        <div className="relative bg-dark-background min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6">
            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-sm sm:max-w-lg mx-auto bg-surface rounded-2xl shadow-2xl p-6 sm:p-12 transform transition-all duration-300 hover:shadow-3xl">
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
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
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
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
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
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Your email"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Your password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 bg-text-primary text-dark rounded-lg shadow-sm text-sm sm:text-base transition-all duration-300 placeholder-text-muted"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading
                                ? "bg-primary-light"
                                : "bg-primary hover:bg-primary-dark"
                        } text-primary py-2 sm:py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base transition-all duration-300`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
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

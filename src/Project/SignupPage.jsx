import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form Submitted", formData);
    // Add further form submission logic here
    axios
      .post('http://localhost:4000/api/user/signup', formData) // Add the correct protocol
      .then((response) => {
        console.log("SignUp Successful:", response.data);
        navigate("/main"); // Navigate to the main page
      })
      .catch((error) => {
        console.error("SignUp Error:", error.response?.data || error.message);
      })
  };
  const navigate = useNavigate();
  const handlelogin = () => {
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <p className="text-center text-gray-600 mb-6">Create your account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="name"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="username"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Re-enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={handlelogin}
              className="text-blue-600 hover:underline font-medium"
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

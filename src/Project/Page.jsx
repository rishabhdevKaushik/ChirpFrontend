import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { apiEndpoints } from "../Api";

const Page = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);
    try {
      
      const response = await apiEndpoints.login(formData); // API call to find user
      console.log(response);
      const { accessToken } = response.data;
      console.log("Login Successful:", accessToken);
  
      // Save the access token to local storage
      localStorage.setItem('accessToken', accessToken);
  
      navigate("/main"); // Navigate to the main page
    } catch (error) {
      console.log(error);
      
      
    }


  };


  const handleSignup = (e) => {

    navigate("/Signup");
  };

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Login</h2>
        <p className="text-center text-gray-600 mb-6 sm:mb-8">Welcome Back!</p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="identifier"
              name="identifier"
              id="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your username or email"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
          >
            Login
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleSignup}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

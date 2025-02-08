import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Button = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium ${className}`}
        >
            {children}
        </button>
    );
};

const Dialog = ({ children, onClose, className }) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${className}`}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
            >
                {children}
            </div>
        </div>
    );
};

const Popup = ({ setIsPopupOpen }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleClose = () => setIsPopupOpen(false);

    const handleLogout = () => {
        // Add your logout logic here
        // console.log("User logged out");
        // axios
        // .post('http://localhost:4000/api/user/logout', refreshToken) // Add the correct protocol
        // .then((response) => {
        //   console.log("Login Successful:", response.data);
        //   navigate("/main"); // Navigate to the main page
        // })
        // .catch((error) => {
        //   console.error("Login Error:", error.response?.data || error.message);
        //   // setError("Login failed. Please check your credentials."); // Update error state
        // })
        setIsPopupOpen(false);
        navigate("/");
    };

    const handleCancel = () => {
        setIsPopupOpen(false);
        // navigate("/main"); // Navigate to the Main page when Cancel is clicked
    };

    return (
        <div>
            <Dialog
                onClose={handleClose}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white p-6 rounded-2xl shadow-xl w-96"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Confirm Logout
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to log out?
                    </p>

                    <div className="flex justify-end gap-4">
                        <Button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            Logout
                        </Button>
                    </div>
                </motion.div>
            </Dialog>
        </div>
    );
};

export default Popup;

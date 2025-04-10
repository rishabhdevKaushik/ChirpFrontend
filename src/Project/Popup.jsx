import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { apiEndpoints } from "../Api";
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
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center ${className}`}
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-lg border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

const Popup = ({ setIsPopupOpen }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleClose = () => setIsPopupOpen(false);

    const handleLogout = async () => {
        try {
            await apiEndpoints.logout();
            localStorage.clear();
            navigate("/");
        } catch (error) {
            // Log the error for debugging
        }
    };

    const handleCancel = () => {
        setIsPopupOpen(false);
        // navigate("/main"); // Navigate to the Main page when Cancel is clicked
    };

    return (
        <div>
            <Dialog
                onClose={handleClose}
                className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-surface p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md border border-gray-700"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">
                        Confirm Logout
                    </h2>
                    <p className="text-muted mb-4 sm:mb-6 text-sm sm:text-base">
                        Are you sure you want to log out?
                    </p>
                    <div className="flex justify-end gap-3 sm:gap-4">
                        <Button
                            onClick={handleCancel}
                            className="bg-surface text-primary hover:bg-surface/80 text-sm sm:text-base px-3 sm:px-4 py-2 border border-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="bg-primary text-primary hover:bg-primary-dark text-sm sm:text-base px-3 sm:px-4 py-2"
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

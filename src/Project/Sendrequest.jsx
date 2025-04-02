import { useState, useEffect } from "react";
import { apiEndpoints } from "../Api";
const SendRequest = ({ username }) => {
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        setShowPopup(true); // Automatically show the popup when component mounts
    }, []);

    const handleFriendRequest = async () => {
        try {
            await apiEndpoints.sendFriendRequest(username);
            setShowPopup(false); // Hide the popup
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl text-center space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Choose an Action
                        </h2>

                        <div className="flex gap-4 justify-center">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                                onClick={handleFriendRequest}
                            >
                                Send Friend Request
                            </button>

                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SendRequest;

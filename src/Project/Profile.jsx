import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserEdit, FaBan } from 'react-icons/fa';
import { apiEndpoints } from '../Api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [popupContent, setPopupContent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch Pending Requests
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.listPendingRequests();
      setPendingRequests(response.data.pendingRequests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setLoading(false);
    }
  };

  // Fetch Blocked Users
  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.listBlockedUsers();
      setBlockedUsers(response.data.blockedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setLoading(false);
    }
  };

  // Handle Unblock User
  const handleUnblockUser = async (username) => {
    setLoading(true);
    try {
      await apiEndpoints.unblockUser(username);
      setBlockedUsers(blockedUsers.filter((user) => user.username !== username));
      setLoading(false);
    } catch (error) {
      console.error('Error unblocking user:', error);
      setLoading(false);
    }
  };

  const handleCardClick = (card) => {
    setPopupContent(card);
    setIsPopupOpen(true);

    if (card.title === 'List of Pending Request') {
      fetchPendingRequests();
    }

    if (card.title === 'Blocked Users') {
      fetchBlockedUsers();
    }

    if (card.title === 'User Updates') {
      navigate('/updateprofile');
    }
  };

  const handleAcceptRequest = async (username) => {
    console.log(`Accepting request from ${username}`);
    // Add API call here
    setLoading(true);
    const data = {status:"ACCEPT"};
    try {
      await apiEndpoints.updateFriendRequest(data, username);
      
      setLoading(false);
    } catch (error) {
      console.error('Error accepting user:', error);
      setLoading(false);
    }finally{
       fetchPendingRequests();
    }  

    // Make new chat with this person
    try {
      const data = {username};
      
      await apiEndpoints.accessChat(data);
    } catch (error) {
      console.error('Error making chat with this user:', error);
    }
};

  const handleBlockRequest = async (username) => {
    console.log(`Blocking user ${username}`);
    // Add API call here
    setLoading(true);
    try {
      await apiEndpoints.blockUser( username);
      setLoading(false);
    } catch (error) {
      console.error('Error block user:', error);
      setLoading(false);
    }finally{
       fetchPendingRequests();
}
  };

  const handleRejectRequest = async (username) => {
    console.log(`Rejecting request from ${username}`);
    // Add API call here
    setLoading(true);
    const data = {status:"REJECT"};
    try {
      await apiEndpoints.updateFriendRequest(data, username);
      
      setLoading(false);
    } catch (error) {
      console.error('Error rejecting user:', error);
      setLoading(false);
    }finally{
       fetchPendingRequests();
}
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const cardsData = [
    { title: 'List of Pending Request', icon: <FaUserPlus className="text-green-500 text-3xl" /> },
    { title: 'Blocked Users', icon: <FaBan className="text-red-500 text-3xl" /> },
    { title: 'User Updates', icon: <FaUserEdit className="text-yellow-500 text-3xl" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8">Profile Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 p-6 rounded-2xl text-center cursor-pointer w-60 h-60 mx-auto flex flex-col justify-center items-center"
            onClick={() => handleCardClick(card)}
          >
            <div className="flex flex-col items-center space-y-4">
              {card.icon}
              <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal for Pending Requests */}
      {isPopupOpen && popupContent.title === 'List of Pending Request' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Pending Requests</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {pendingRequests.length === 0 ? (
                  <p>No pending requests.</p>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="flex justify-between items-center mb-4 p-4 border-b">
                      <span className="font-semibold">{request.sender.username}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(request.sender.username)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleBlockRequest(request.sender.username)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                        >
                          Block
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.sender.username)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors duration-300"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <button
              onClick={closePopup}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal for Blocked Users */}
      {isPopupOpen && popupContent.title === 'Blocked Users' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Blocked Users</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {blockedUsers.length === 0 ? (
                  <p>No blocked users.</p>
                ) : (
                  blockedUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center mb-4 p-4 border-b">
                      <span className="font-semibold">{user.username}</span>
                      <button
                        onClick={() => handleUnblockUser(user.username)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                      >
                        Unblock
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
            <button
              onClick={closePopup}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

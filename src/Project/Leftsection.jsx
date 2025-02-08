import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../Api'; // Ensure this path and file export are correct
import SendRequest from './Sendrequest'; // Import the SendRequest component
import socket from '../socket';

const LeftSection = ({ onSelectFriend }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [globalSearchResult, setGlobalSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSendRequest, setShowSendRequest] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch friends from backend
    const fetchFriends = async () => {
      try {
        const currentUsername = localStorage.getItem("currentUsername");
        
        const response = await apiEndpoints.fetchChat();

        // Assuming 'currentUser' data is available in the response
        // Initialize an array to hold the friends
        const fetchedFriends = [];

        // Iterate through each chat object in the response
        response.data.forEach(chat => {
          if (chat.isGroup) {
            // If it's a group chat, add the chatName to the friends list
            fetchedFriends.push({
              id: chat._id, // Use the chat ID as a unique identifier
              name: chat.chatName,
              isGroup: true
            });
          } else {
            // If it's not a group chat, filter out the current user and add the other user
            chat.users.forEach(user => {
              if (user.username !== currentUsername) {
                fetchedFriends.push({
                  id: chat._id,
                  name: user.username,
                  isGroup: false
                });
              }
            });
          }
        });

        // Merge friends while avoiding duplicates
        setFriends((prevFriends) => {
          const uniqueFriends = [...prevFriends, ...fetchedFriends].reduce((acc, friend) => {
            if (!acc.some(existing => existing.id === friend.id)) {
              acc.push(friend);
            }
            return acc;
          }, []);
          return uniqueFriends;
        });
      } catch (err) {
        setError('Failed to fetch friends list.');
      }
    };

    fetchFriends();
  }, []);

  const filteredFriends = isGlobalSearch
    ? []
    : friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (isGlobalSearch && query.trim()) {
      setLoading(true);
      setError(null);
      setGlobalSearchResult(null);

      try {
        const response = await apiEndpoints.findUser(query); // API call to find user
        setGlobalSearchResult(response.data.user || null);
      } catch (err) {
        setError('Failed to search globally. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckboxChange = () => {
    setIsGlobalSearch((prev) => !prev);
    setGlobalSearchResult(null);
    setSearchQuery('');
  };

  const handleSelectChat = (chat) =>{    
    localStorage.setItem("selectedChat", chat);
    localStorage.setItem("selectedChatId", chat.id);
    // Join the chat room when a friend is selected
    socket.emit("join chat", chat.id);
    
    
    onSelectFriend(chat);
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 md:p-6">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={isGlobalSearch ? "Search globally..." : "Search friends..."}
            className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={isGlobalSearch}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-gray-700">Search Globally</label>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {isGlobalSearch ? 'Global Search Results' : ''}
        </h3>
        <div className="space-y-5">
          {!isGlobalSearch ? (
            filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div
                  key={friend.name}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
                  // onClick={() => onSelectFriend(friend)}
                  onClick={() => handleSelectChat(friend)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={friend.avatar || 'https://i.pravatar.cc/150?img=2'} // Default to Jane Smith's avatar
                      alt={friend.name}
                      className="w-12 h-12 rounded-full border-2"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{friend.name}</h4>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No friends found</p>
            )
          ) : loading ? (
            <p className="text-gray-500">Searching globally...</p>
          ) : globalSearchResult ? (
            <div
              className="p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
              onClick={() => setShowSendRequest(true)}
            >
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-gray-800">
                  {globalSearchResult.name}
                </h4>
                <p className="text-sm text-gray-600">Username: {globalSearchResult.username}</p>
                <p className="text-sm text-gray-600">Email: {globalSearchResult.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">{error || (searchQuery ? 'No user found' : '')}</p>
          )}
        </div>
      </div>

      {/* Render SendRequest popup if true */}
      {showSendRequest && <SendRequest username={globalSearchResult.username} />}
    </div>
  );
};

export default LeftSection;

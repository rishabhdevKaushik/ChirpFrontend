import React, { useState, useRef, useEffect } from 'react';

const RightSection = ({ selectedFriend }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col p-4 bg-gray-100 rounded-lg shadow-md h-full w-full max-w-full">
      {/* Display Selected Friend */}
      {selectedFriend ? (
        <div className="flex items-center space-x-3 mb-4 p-4 bg-white shadow-md rounded-lg hover:bg-gray-50 transition duration-300 ease-in-out">
          <img
            src={selectedFriend.avatar}
            alt={selectedFriend.name}
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors duration-300 ease-in-out">
            {selectedFriend.name}
          </h3>
        </div>
      ) : (
        <p className="text-gray-500 text-center mb-4">
          Select a friend to start chatting
        </p>
      )}

      {/* Messages Display */}
      <div
        ref={messagesEndRef}
        className="flex-grow mb-4 overflow-y-auto bg-white p-3 rounded-lg shadow-md flex flex-col-reverse"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-blue-500 text-white p-3 rounded-lg mb-2 shadow-md max-w-sm self-end break-words"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-2 mt-4">
        <div className="relative w-full">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full p-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] pr-16" // Added padding-right for the button
            rows="1"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSection;

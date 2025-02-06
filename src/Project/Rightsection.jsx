import React, { useState, useRef, useEffect } from 'react';
import { apiEndpoints } from '../Api';
import socket from '../socket.js';

const RightSection = ({ selectedFriend }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null); // Tracks the selected message for popup
  const messagesEndRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const currentUsername = localStorage.getItem('currentUsername');
  const currentUserId= localStorage.getItem('currentUserId');

  var selectedChat = localStorage.getItem('selectedChat');
  

  // Initialize socket connection
  useEffect(() => {

    socket.connect();

    socket.emit("setup", currentUserId); // send current user id

    socket.on("connected", () =>{
      console.log("Connected to socket io server");
      
    });

    // For incomming message
    socket.on("message recieved", (msg) =>{
      setMessage((msg) =>{
        setMessages((prevMessages) => [...prevMessages, msg]);
      setMessage('');
      })
    });

    // // Join the chat room when a friend is selected
    // const joinChat = () =>{
    //   socket.emit("join chat", selectedChat.id);
    // }

    socket.on("typing", ()=>{
      setTyping("true");
    });
  
    socket.on("stopTyping", ()=>{
      setTyping("false");
    });
    
    
    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  


  const handleChange = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", selectedChat.id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        content: message,
        sender: { username: currentUsername },
      };

      // Update UI optimistically
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      try {
        const data = {
          content: message,
          chatId: selectedFriend.id,
        };

        // Send message to the server
        const response = await apiEndpoints.sendmsg(data);
        // For outgoing message
        socket.emit("new message", newMessage);

        // Emit the message via Socket.IO
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const getMessages = async (chatId) => {
    try {
      const response = await apiEndpoints.getallmsgofchat(chatId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Fetch messages when a friend is selected
  useEffect(() => {
    if (selectedFriend) {
      getMessages(selectedFriend.id);
    }
  }, [selectedFriend]);

  // Scroll to the bottom of the messages container
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDoubleClick = (msg) => {
    setSelectedMsg(msg);
  };

  const handleEdit = async () => {
    const updatedContent = prompt('Edit Message:', selectedMsg.content);
    if (updatedContent !== null && updatedContent.trim() !== '') {
      try {
        const data = {
          messageId: selectedMsg._id,
          content: updatedContent,
        };

        await apiEndpoints.editmsg(data);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg === selectedMsg ? { ...msg, content: updatedContent } : msg
          )
        );
      } catch (error) {
        console.error('Error while editing message:', error);
      }
      setSelectedMsg(null);
    }
  };

  const handleDelete = async () => {
    try {
      await apiEndpoints.deleteMessage(selectedMsg._id);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== selectedMsg._id)
      );
    } catch (error) {
      console.error('Error while deleting message:', error);
    }
    setSelectedMsg(null);
  };

  const handleSelect = () => {
    console.log('Selected Message:', selectedMsg);
    setSelectedMsg(null);
  };

  return (
    <div className="flex flex-col p-4 bg-gray-100 rounded-lg shadow-md h-full w-full max-w-full">
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
        className="flex-grow mb-4 overflow-y-auto bg-white p-3 rounded-lg shadow-md flex flex-col"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            onDoubleClick={() => handleDoubleClick(msg)}
            className={`p-3 rounded-lg mb-2 shadow-md max-w-sm break-words ${
              msg.sender.username === currentUsername
                ? 'self-end bg-blue-500 text-white'
                : 'self-start bg-gray-300 text-gray-800'
            } cursor-pointer hover:shadow-lg transition-shadow duration-300`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Popup for Message Options */}
      {selectedMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-700">Message Actions</h3>
            {selectedMsg.sender.username === currentUsername ? (
              <>
                <button
                  onClick={handleEdit}
                  className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            ) : (
              <p className="text-gray-500">You can only edit or delete your own messages.</p>
            )}
            <button
              onClick={handleSelect}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
            >
              Select
            </button>
            <button
              onClick={() => setSelectedMsg(null)}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-center space-x-2 mt-4">
        <div className="relative w-full">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full p-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] pr-16"
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
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://chirpbackend-9pjh.onrender.com";

const socket = io(SOCKET_SERVER_URL, {
    autoConnect : false, // Prevents automatic connection before login
});

export default socket;
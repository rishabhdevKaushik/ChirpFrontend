import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL;

const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;

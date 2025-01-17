import { io } from "socket.io-client";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const socket = io(backendUrl);

export {socket}
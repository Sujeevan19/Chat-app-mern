// socket.js (frontend)
import { io } from "socket.io-client";

// Replace with your backend's actual address
const ENDPOINT = "http://localhost:5000"; // or use your deployed URL

export const socket = io(ENDPOINT, {
  transports: ["websocket"],
  autoConnect: false,  // prevent auto connect; connect manually after auth
});

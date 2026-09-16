import { io } from "socket.io-client";
import { getEnv } from "../configs/env";

let socket = null;

// one connection, cookie authenticated
const connectSocket = () => {
  if (socket) return socket;
  socket = io(getEnv("VITE_SERVER_URL"), { withCredentials: true });
  return socket;
};

const getSocket = () => socket;

const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

// hands back its own unsubscribe
const onSocketEvent = (event, handler) => {
  const liveSocket = connectSocket();
  liveSocket.on(event, handler);
  return () => liveSocket.off(event, handler);
};

export { connectSocket, disconnectSocket, getSocket, onSocketEvent };

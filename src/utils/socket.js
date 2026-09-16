import { io } from "socket.io-client";
import { getEnv } from "../configs/env";

let socket = null;

// one connection for the whole app, the session cookie authenticates it
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

// hands back the unsubscribe, so an effect cleans up exactly what it added
const onSocketEvent = (event, handler) => {
  socket?.on(event, handler);
  return () => socket?.off(event, handler);
};

export { connectSocket, disconnectSocket, getSocket, onSocketEvent };

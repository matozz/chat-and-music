import React from "react";
import { io } from "socket.io-client";

// export const API_URL = "http://127.0.0.1:3001";
export const API_URL = "http://192.168.124.3:3001";
// export const API_URL = "https://fbe1-58-199-250-54.ngrok.io";
// export const API_URL =
//   "https://chat-app-server-1347633-1300523937.ap-shanghai.run.tcloudbase.com";

export const socket = io(`${API_URL}`);

const SocketContext = React.createContext();

export default SocketContext;

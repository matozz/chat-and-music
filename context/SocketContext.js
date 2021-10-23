import React from "react";
import { io } from "socket.io-client";

// export const API_URL = "http://127.0.0.1:3001";
export const API_URL = "http://192.168.0.107:3001";

export const socket = io(`${API_URL}`);

const SocketContext = React.createContext();

export default SocketContext;

import { io } from "socket.io-client";

// const API_URL = "http://127.0.0.1:3001";
const API_URL = "https://6ee2-58-199-250-9.ngrok.io";

export const socket = io(`${API_URL}`);

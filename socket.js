import { io } from "socket.io-client";

export const socket = io(`https://${process.env.EXPO_PUBLIC_API_URL}`);

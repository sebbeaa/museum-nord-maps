import { createContext } from "react";
import { io } from "socket.io-client";

// export const socket = io("https://gaia-maps-api-6xwo7d2lmq-lz.a.run.app");
export const socket = io("http://localhost:3000");

export const SocketContext = createContext({});

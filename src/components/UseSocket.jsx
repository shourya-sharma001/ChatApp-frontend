import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "production"
    ? "wss://chatapp-backend-g1ef.onrender.com" // Use Render backend in production
    : "ws://localhost:8001"; // Use localhost for development

const UseSocket = (userId) => {
  const socketRef = useRef();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        transports: ["websocket"], // Ensure WebSocket transport
        reconnection: true, // Allow auto-reconnect
        reconnectionAttempts: 5, // Try reconnecting 5 times
        reconnectionDelay: 3000, // Wait 3 seconds between attempts
      });

      

      newSocket.emit("initialize-socket", userId);
      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          console.log("Socket disconnected");
          socketRef.current = null;
        }
      };
    }
  }, [userId]);

  return { socket };
};

export default UseSocket;

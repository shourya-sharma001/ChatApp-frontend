import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const UseSocket = (userId) => {
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8002");

      console.log("Socket initialized:", socketRef.current.id);
    }

    if (userId) {
      socketRef.current.emit("register-user", userId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
        socketRef.current = null; 
      }
    };
  }, [userId]);

  return socketRef.current;
};

export default UseSocket;

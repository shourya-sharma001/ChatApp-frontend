import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const UseSocket = (userId) => {
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current && userId) {
      socketRef.current = io("http://localhost:8002");

      socketRef.current.emit("register-user", userId);
      console.log("Socket initialized:", socketRef.current.id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
        socketRef.current = null; 
      }
    };
  }, [userId]);
  

  return  {socket:socketRef.current} ;
};

export default UseSocket;

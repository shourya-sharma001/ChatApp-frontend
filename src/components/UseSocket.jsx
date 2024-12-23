import React, { useEffect } from 'react'
import {io} from "socket.io-client"



const UseSocket = (userId) => {
  const socket = io("http://localhost:8002")
  console.log(userId);
  
  useEffect(()=>{
    if(userId){
        socket.emit("register-user",userId)
    }

    return()=>{
        socket.disconnect()
    }

  },[userId])

  return socket
}

export default UseSocket

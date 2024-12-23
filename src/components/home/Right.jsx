import React, { useEffect, useState } from "react";

const Right = ({ recipient, socket, loggedInUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Received data:", data); // Debug log
      if (data.senderId === recipient._id) {
        setMessages((prev) => [...prev, { message: data.message, isIncoming: true }]);
      }
    };
  
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message");
    };
  },[recipient._id, socket]);



  const sendMessage = () => {
    const messageData = {
      senderId: loggedInUser._id,
      recipientId: recipient._id,
      message: newMessage,
    };

    socket.emit("private-message", messageData);

    // setMessages((prev) => [...prev, { ...messageData, isIncoming: false }]);
    setNewMessage("");
  };

  return (
    <div>
      <h2>Chat with {recipient.username}</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.isIncoming ? "text-left" : "text-right"}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Right;

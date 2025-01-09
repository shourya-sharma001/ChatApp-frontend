import React, { useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';

const Right = ({ recipient, socket, loggedInUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messageRef = useRef(null)

  useEffect(()=>{
    messageRef.current?.scrollIntoView({behaviour: "smooth"});
  },[messages])

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.id);
    });

    console.log(socket);
    const handleReceiveMessage = (data) => {
      if (data.senderId === recipient._id) {
        setMessages((prev) => [
          ...prev,
          { message: data.message, isIncoming: true },
        ]);
      }
    };
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message");
    };
  }, [recipient._id, socket]);

  const sendMessage = (e) => {
    e.preventDefault()
    const messageData = {
      senderId: loggedInUser._id,
      recipientId: recipient._id,
      message: newMessage,
    };

    socket.emit("private-message", messageData);

    setMessages((prev) => [...prev, { ...messageData, isIncoming: false }]);
    setNewMessage("");
  };

  return (
    <div className="border-2 border-black rounded-lg  p-2">
      <h2 className="text-center text-xl font-bold">Chat with {recipient.username}</h2>

      <div className="messages h-[60vh] mb-2 overflow-scroll scrollbar-hide flex flex-col" aria-live="polite">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.isIncoming
                ? `text-left border-2 bg-[rgb(85,188,140)] p-2 w-fit m-1 rounded-lg self-start text-white`
                : "text-right border-2 bg-[rgb(69,106,165)] p-2 w-fit m-1 rounded-lg self-end text-white"
            }
          >
            {msg.message}
          </div>
        ))}
        <div ref={messageRef} />
      </div>

      <div>
      <form action="" onSubmit={(e)=>sendMessage(e)} className="flex">
      <input
          type="text" 
          placeholder="Enter your message here"
          className="w-full border-2 border-black rounded-lg p-2"
          value={newMessage}
          autoFocus={true}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit"><SendIcon color="success"/></button>
      </form>
      </div>
    </div>
  );
};

export default Right;

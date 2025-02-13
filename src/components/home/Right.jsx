import { useEffect, useRef, useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import { UserContext } from "../Wrapper";

const Right = () => {
  const {
    user,
    socket,
    selecteduser,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
  } = useContext(UserContext);

  let recipient = selecteduser;
  let loggedInUser = user;

  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.senderId === recipient._id || data.recipientId === loggedInUser._id) {
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
  }, [recipient._id, socket, setMessages,newMessage]);

  useEffect(() => {
    const fetchMessages = async () => {

      if (!recipient._id) return;

      try {
        const response = await fetch(
           `https://chatapp-backend-g1ef.onrender.com/messages/${loggedInUser._id}/${recipient._id}`
        );
        const data = await response.json();
        const formattedMessages = data.messages.map((msg) => ({
          ...msg,
          isIncoming: msg.senderId !== user._id, // True if the message is not sent by the logged-in user
        }));

        setMessages(
          formattedMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selecteduser) {
      fetchMessages();
    }

    return () => {
      socket.off("receive-message");
    };
  }, [recipient._id, socket, setMessages,newMessage]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = {
      senderId: loggedInUser._id,
      recipientId: recipient._id,
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    socket.emit("private-message", messageData);

    try {
      const response = await fetch("https://chatapp-backend-g1ef.onrender.com/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Update the messages state
      setMessages((prev) => [...prev, { ...messageData, isIncoming: false }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // function to clear the messages

  const clearMessages = async () => {

    try {
      const response = await fetch(
        `https://chatapp-backend-g1ef.onrender.com/messages/${loggedInUser._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error clearing messages:", errorData);
        throw new Error("Failed to clear messages");
      }

      setMessages([]); // Clear the messages in the frontend state
      console.log("Messages cleared successfully");
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-2 bg-[#F8F5E9] shadow-md max-w-screen-md mx-auto my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Chat with {recipient.username}
        </h2>

        <button className="px-2 py-1 text-sm bg-red-500 text-white font-bold rounded-3xl hover:bg-red-600 transition" 
        onClick={clearMessages}>Clear msg</button>
      </div>

      <div
        className="messages h-[45vh] mb-4 overflow-scroll scrollbar-hide scroll-smooth flex flex-col bg-[#F8F5E9] rounded-md p-2"
        aria-live="polite"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.isIncoming
                ? "self-start bg-green-500 text-white"
                : "self-end bg-blue-500 text-white"
            } h-7 px-4 pb-6 rounded-lg w-fit mb-1 shadow-sm my-2`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messageRef} />
      </div>

      <div>
        <form
          action=""
          onSubmit={(e) => {
            newMessage.length > 0 ? sendMessage(e) : e.preventDefault();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Enter your message here"
            className="flex-grow border-2 border-gray-300 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            autoFocus={true}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="flex items-center justify-center bg-blue-500 text-white font-bold rounded-full px-2 py-2 hover:bg-blue-600 transition">
            <SendIcon  />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Right;

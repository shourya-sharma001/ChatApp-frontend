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
    onlineUsers,
  } = useContext(UserContext);

  const OnlineUsersId = Object.keys(onlineUsers);

  let recipient = selecteduser;
  let loggedInUser = user;

  const messageRef = useRef(null);

  useEffect(() => {
    const messagesContainer = document.querySelector(".messages");
    if (!messagesContainer) return;

    // Check if the user is at the bottom before auto-scrolling
    const isAtBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + 50;

    if (isAtBottom) {
      messageRef.current?.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (
        data.senderId === recipient._id ||
        data.recipientId === loggedInUser._id
      ) {
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
  }, [recipient._id, socket, setMessages, newMessage, messages]);

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
  }, [recipient._id, socket, setMessages, newMessage, messages]);

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

      setMessages([]);
      console.log("Messages cleared successfully");
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-[#F8F5E9] shadow-lg rounded-xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-top border-2 border-green-500"
            style={
              recipient.profileImage
                ? { backgroundImage: `url(${recipient.profileImage})` }
                : { backgroundImage: `url("/unknown-person-icon.webp")` }
            }
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {recipient.username}
            </h2>
            <span className={`text-sm ${OnlineUsersId.includes(recipient._id) ? "text-green-600" : "text-gray-400"}`}>
              {OnlineUsersId.includes(recipient._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <button
          className="px-3 py-1.5 text-sm bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95"
          onClick={clearMessages}
        >
          Clear Chat
        </button>
      </div>

      <div
        className="flex-1 mb-4 overflow-y-auto scrollbar-hide scroll-smooth bg-white/50 rounded-xl p-4"
        aria-live="polite"
      >
        <div className="flex flex-col space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.isIncoming ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md
                  ${
                    msg.isIncoming
                      ? "bg-green-500 text-white rounded-bl-none"
                      : "bg-blue-500 text-white rounded-br-none"
                  }`}
              >
                <p className="text-sm sm:text-base break-words">
                  {msg.message}
                </p>
                <span className="text-xs opacity-75 mt-1 block">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : ""}
                </span>
              </div>
            </div>
          ))}
          <div ref={messageRef} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-md">
        <form
          onSubmit={(e) => {
            newMessage.length > 0 ? sendMessage(e) : e.preventDefault();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            value={newMessage}
            autoFocus={true}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.length}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Right;

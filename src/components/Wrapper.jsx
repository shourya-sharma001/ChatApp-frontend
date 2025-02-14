import {  useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import App from "../App";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import UseSocket from "./UseSocket";
import { UserContext } from "../context/UserContext";


const Wrapper = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState({});
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selecteduser, setSelectedUser] = useState("");
  const [toggle, setToggle] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { socket } = UseSocket(user._id);

  const handleRegister = async (e, username, email, password, selectedFile) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "chatApp");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/erfanaalam/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const CloudinaryData = await res.json();
        imageUrl = CloudinaryData.secure_url;
      }

      let userdata = {
        username,
        email,
        password,
        profileImage: imageUrl,
      };

      fetch("https://chatapp-backend-g1ef.onrender.com/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userdata),
      }).then(async (response) => {
        let result = await response.json();
        alert(result.result);
        navigate("/login");
      });
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed!");
    }
  };

  const handleLogin = (e, email, password) => {
    e.preventDefault();

    let loginDetail = {
      email,
      password,
    };

    fetch("https://chatapp-backend-g1ef.onrender.com/login", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginDetail),
    }).then(async (response) => {
      let result = await response.json();
      alert(result.result);
      if (response.ok) {
        navigate("/home");
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch("https://chatapp-backend-g1ef.onrender.com/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.result === "Token has expired"
          ) {
            console.warn("Token has expired. Logging out...");
            Cookies.remove("token");
            return;
          }

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setuser(data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();

    try {
      fetch("http://localhost:8001/logout", {
        method: "POST",
        credentials: "include",
      }).then((response) => {
        if (response.ok) {
          navigate("/login");
        } else {
          console.log("failed to logout");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("https://chatapp-backend-g1ef.onrender.com/allusers");
        const data = await response.json();
        setUsers(data.users);
        setOnlineUsers(data.onlineUsers);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, [navigate]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setToggle(false);
    // setMessages([])
  };

  return (
    <UserContext.Provider
      value={{
        handleRegister,
        handleLogin,
        user,
        users,
        onlineUsers,
        socket,
        handleUserSelect,
        toggle,
        selecteduser,
        setToggle,
        messages,
        setMessages,
        newMessage,
        setNewMessage,
      }}
    >
      
      <header className="p-3 sm:p-4 bg-[#3A7D44] text-white flex flex-wrap justify-between items-center shadow-lg">
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className="profileImage w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md transition-transform hover:scale-105"
            style={user.profileImage ? { backgroundImage: `url(${user.profileImage})` } : { backgroundImage: `url("unknown-person-icon.webp")` }}
          ></div>
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-center">
            Welcome, <span className="text-yellow-200">{user.username}</span>
          </h1>
        </div>
        <button
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-lg font-semibold bg-red-500 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-red-600 transition-all duration-300 hover:shadow-lg active:scale-95"
          onClick={(e) => handleLogout(e)}
        >
          <span className="hidden sm:inline-block">Logout</span>
          <LogoutIcon className="w-5 h-5 sm:w-6 sm:h-6" onClick={() => navigate("/")} />
        </button>
      </header>

      <main className="">
        <div className=" mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<App />} />
          </Routes>
        </div>
      </main>
    </UserContext.Provider>
  );
};

export default Wrapper;

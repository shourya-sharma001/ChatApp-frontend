import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import App from "../App";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import UseSocket from "./UseSocket";

export const UserContext = createContext();

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

  console.log(socket?.id);

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

      fetch("http://localhost:8001/register", {
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

    fetch("http://localhost:8001/login", {
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

        const response = await fetch("http://localhost:8001/getUser", {
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
        console.log(data.result);
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
        const response = await fetch("http://localhost:8001/allusers");
        const data = await response.json();
        console.log(data.users);
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
      <header className="p-4 bg-[#3A7D44] text-white flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-4">

          <div
            className="profileImage w-12 h-12 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${user.profileImage})` }}
          ></div>
          <h1 className="text-lg md:text-2xl font-bold text-center">
            Welcome, <span>{user.username}</span>
            {/* <span>Erfan's ChatApp</span> */}
          </h1>
        </div>
        <button
          className="flex items-center gap-2 text-sm md:text-lg font-semibold bg-red-500 px-3 py-2 rounded-3xl hover:bg-red-600 transition"
          onClick={(e) => handleLogout(e)}
        >
          <span className="hidden md:inline-block">Logout</span>
          <LogoutIcon />
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

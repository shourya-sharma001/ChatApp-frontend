import React, { createContext, useEffect, useState } from "react";
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

  const socket = UseSocket(user._id);

  const handleRegister = (e, username, email, password) => {
    e.preventDefault();

    console.log(username, email, password);

    let userdata = {
      username,
      email,
      password,
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
        setToggle
      }}
    >
      <div className="p-6 bg-gray-500 flex justify-around ">
        <h2 className="text-xl md:text-2xl text-center font-bold flex flex-col md:flex-row gap-1">
          <span> Welcome {user.username}  </span>
          <span> to Erfan's ChatApp</span>
        </h2>
        <button className="text-2xl font-bold" onClick={(e) => handleLogout(e)}>
          <span className="hidden md:inline-block">Logout</span>
          <LogoutIcon />
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<App />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default Wrapper;

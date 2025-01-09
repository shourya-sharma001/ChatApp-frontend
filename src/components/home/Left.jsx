import { useContext, useState } from "react";
import { UserContext } from "../Wrapper";
import UseSocket from "../UseSocket";
import Right from "./Right";
import MenuIcon from '@mui/icons-material/Menu';

const Left = () => {
  const { user, users, onlineUsers } = useContext(UserContext);

  const [selecteduser, setSelectedUser] = useState("");
  const [toggle,setToggle] = useState(true)

  // console.log(user);
  const socket = UseSocket(user._id);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setToggle(false)
  };

  console.log(onlineUsers);
  const OnlineUsersId = Object.keys(onlineUsers);
  // console.log(OnlineUsersId);

  return (
    <div className="flex">
     {
      toggle ?
      <div className=" p-4 bg-gray-200">
      <h2 className="text-xl font-bold">Users</h2>
      <ul>
        {users.filter(person => person._id !== user._id)
        .map((person, index) => (
          <li
            key={index}
            onClick={() => handleUserSelect(person)}
            className={`text-xl font-semibold m-3 border-2 p-2 border-black rounded-lg text-center hover:bg-gray-300 hover:cursor-pointer
              ${OnlineUsersId.includes(person._id) ? 'bg-green-300 border-green-500' : ''} `}
          >
            {person.username}
          </li>
        ))}
      </ul>
    </div> :
    <div onClick={()=>setToggle(true)}><MenuIcon/></div>
     }


      <div className="w-full p-4">
        {selecteduser ? (
          <Right recipient={selecteduser} socket={socket} loggedInUser={user} />
        ) : (
          <p>Select a user to chat with</p>
        )}
      </div>
    </div>
  );
};

export default Left;

import { useContext } from "react";
import { UserContext } from "../Wrapper";
import Right from "./Right";
import MenuIcon from "@mui/icons-material/Menu";

const Left = () => {
  const {
    user,
    users,
    onlineUsers,
    handleUserSelect,
    toggle,
    selecteduser,
    setToggle,
  } = useContext(UserContext);

  const OnlineUsersId = Object.keys(onlineUsers);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="flex max-h-[75vh] relative ">
      {toggle ? (
        <div className={`p-4 bg-[#9DC08B] overflow-scroll scrollbar-hide scroll-smooth rounded-md absolute top-0 left-[-15px] z-50 transform transition-transform duration-300 ease-in-out ${
          toggle ? "translate-x-0" : "-translate-x-full"}`}>
          <h2 className="text-xl font-bold">Users</h2>
          <ul>
            {users
              .filter((person) => person._id !== user._id)
              .map((person, index) => (
                <li
                  key={index}
                  onClick={() => handleUserSelect (person)}
                  className={`text-xl flex items-center gap-4 font-semibold m-3 border-2 p-1 border-black rounded-3xl hover:bg-gray-300 hover:cursor-pointer
              ${
                OnlineUsersId.includes(person._id)
                  ? "bg-green-300 border-green-500"
                  : ""
              } `}
                >
          <div
            className="profileImage w-9 h-9 rounded-full bg-cover bg-center"
            style={person.profileImage ? { backgroundImage: `url(${person.profileImage})` } : { backgroundImage: `url("unknown-person-icon.webp")` }}
          ></div>
                  {capitalize(person.username)}

                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div onClick={() => setToggle(true)} className="absolute top-[-20px] z-50 cursor-pointer">
          <MenuIcon />
        </div>
      )}

      <div className="w-full p-2">
        {selecteduser ? <Right /> : <p>Select a user to chat with</p>}
      </div>
    </div>
  );
};

export default Left;

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
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
    <div className="flex min-h-[75vh] md:min-h-[75vh] relative ">
      {toggle ? (
        <div 
          className={`p-4 bg-[#9DC08B] overflow-y-auto scrollbar-hide rounded-lg shadow-lg fixed md:absolute top-0 left-0 md:left-[-15px] z-50 h-screen md:h-auto w-[85vw] md:w-auto transform transition-transform duration-300 ease-in-out ${
            toggle ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label="Users list"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Available Users</h2>
            <button 
              onClick={() => setToggle(false)}
              className="md:hidden text-gray-600 hover:text-gray-800"
              aria-label="Close users list"
            >
              <MenuIcon />
            </button>
          </div>
          <ul className="space-y-3">
            {users
              .filter((person) => person._id !== user._id)
              .map((person) => (
                <li
                  key={person._id}
                  onClick={() => handleUserSelect(person)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer
                    ${OnlineUsersId.includes(person._id)
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-white border-2 border-gray-200 hover:border-[#9DC08B]"
                    }`}
                  role="button"
                  aria-label={`Chat with ${person.username}`}
                >
                  <div
                    className="profileImage w-12 h-12 rounded-full bg-cover bg-top border-2 border-[#9DC08B] shadow-sm"
                    style={person.profileImage 
                      ? { backgroundImage: `url(${person.profileImage})` }
                      : { backgroundImage: `url("/unknown-person-icon.webp")` }
                    }
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {capitalize(person.username)}
                    </span>
                    <span className={`text-sm ${OnlineUsersId.includes(person?._id.toString()) ? "text-green-600" : "text-gray-400"}`}>
                      {OnlineUsersId.includes(person._id.toString()) ? "Online" : "Offline"}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <button
          onClick={() => setToggle(true)}
          className="fixed md:absolute top-16 left-0 z-50 p-2 bg-[#9DC08B] shadow-lg hover:bg-[#8ab077] transition-colors duration-200"
          aria-label="Open users list"
        >
          <MenuIcon className="text-white" />
        </button>
      )}

      <div className="w-full p-4 md:p-6">
        {selecteduser ? (
          <Right />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <img 
              src="/chat-illustration.avif" 
              alt="Select a user"
              className="w-48 h-48 mb-4 "
            />
            <p className="text-xl text-gray-600">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Left;

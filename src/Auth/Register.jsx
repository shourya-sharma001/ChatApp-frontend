import { useContext, useState } from "react";
import { UserContext } from "../components/Wrapper";

const Register = () => {
  const { handleRegister } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#B8D576] rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form
        onSubmit={(e) =>
          handleRegister(e, username, email, password, selectedFile)
        }
      >
        <div className="mb-4">
          <label
            htmlFor="profileImage"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            name="username"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className={`mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 `}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 `}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 `}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <div className="flex gap-6">
          <h1>Already Registered! </h1>
          <a href="/login" className="underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;

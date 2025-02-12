import { useContext, useState } from 'react'
import { UserContext } from '../components/Wrapper'

const Register = () => {

    const {handleLogin} = useContext(UserContext)

    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#B8D576] rounded shadow-md">
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    <form onSubmit={(e)=>handleLogin(e,email,password)}>
    

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e)=>setEmail(e.target.value)}
          className={`mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e)=>setPassword(e.target.value)}
          className={`mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 `}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <div className='flex gap-6'>
      <h1>New user!</h1>
      <a href="/" className="underline">Register now</a>
      </div>
    </form>
  </div>
  )
}

export default Register

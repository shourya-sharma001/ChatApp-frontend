import React, {useContext, useState} from 'react'
import { UserContext } from '../Wrapper'
import UseSocket from '../UseSocket'
import Right from './Right';

const Left = () => {
    const {user,users} = useContext(UserContext)

    const [ selecteduser,setSelectedUser] = useState("")
    
    // console.log(user);
    const socket = UseSocket(user._id)
    
    const handleUserSelect = (user)=>{
        setSelectedUser(user)
    }

  return (

    <div className="flex">
    {/* User List */}
    <div className="w-1/3 p-4 bg-gray-200">
      <h2 className="text-xl font-bold">Users</h2>
      <ul>
        {users.map((person,index) => (
          <li key={index} onClick={() => handleUserSelect(person)} className='text-xl font-semibold m-3 border-2 p-2'>{person.username}</li>
        ))}
      </ul>
    </div>

    {/* Chat Dashboard */}
    <div className="w-2/3 p-4">
      {selecteduser ? (
        <Right recipient={selecteduser} socket={socket} loggedInUser={user} />
      ) : (
        <p>Select a user to chat with</p>
      )}
    </div>
  </div>
);


}

export default Left

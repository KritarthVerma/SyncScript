import React from 'react'
import Client from "../components/Client"
import toast from 'react-hot-toast';

const Aside = ({leaveRoom,roomId,clients}) => {
  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied successfully!");
    } catch (error) {
      toast.error("Failed to copy Room ID!");
    }
  }
  return (
    <div className="aside">
        <div className='logo'>
            <img className="logoImage" src='/logo2.png' alt='logo'/>
        </div>
        <div className='asideInner'>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map((client)=>(
                <Client
                  key={client.socketId} 
                  username={client.username}
                />
              ))
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
    </div>
  )
}

export default Aside

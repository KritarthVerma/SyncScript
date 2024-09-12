import React, { useState } from 'react'
import {v4 as uuidV4} from "uuid"
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate();

  const [roomId,setRoomId] = useState("");
  const [username,setUsername] = useState("");

  const joinRoom = ()=>{
    if(!roomId || !username){
      toast.error("Room Id and Usename are required");
      return;
    }
    navigate(`/editor/${roomId}`,{
      state : {
        username,
      },
    });
  }
  const createNewRoom = (event)=>{
    event.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img className="homePageLogo" src="/logo.png" alt="sync-script-logo"/>
            <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
            <div className='inputGroup'>
              <input 
                type="text" 
                className='inputBox' 
                placeholder='ROOM ID'
                onChange={(e)=>{setRoomId(e.target.value)}}
                onKeyUp={(e)=>{if(e.key==='Enter')joinRoom()}}
                value={roomId}/>
              <input 
                type="text" 
                className='inputBox'
                value={username}
                onChange={(e)=>{setUsername(e.target.value)}}
                onKeyUp={(e)=>{if(e.key==='Enter')joinRoom()}}
                placeholder='USERNAME'/>
              <button 
                onClick={joinRoom}
                className='btn joinBtn'>
                  Join
              </button>
              <span className='createInfo'>
                If you don't have an invite then create &nbsp; 
                <a onClick={createNewRoom} href="" className='createNewBtn'>New room</a>
              </span>
            </div>
        </div>
        <footer>
          <h4>Built with &#x1F49B; by <a href="https://github.com/KritarthVerma">Kritarth</a></h4>
        </footer>
    </div>
  )
}

export default Home

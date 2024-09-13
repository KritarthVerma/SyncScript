import React, { useEffect, useRef, useState } from 'react'
import Editor from "../components/Editor"
import Client from "../components/Client"
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation } from 'react-router-dom';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();

  useEffect(()=>{
    const init = async ()=>{
      socketRef.current = await initSocket();
      // socketRef.current.emit(ACTIONS.JOIN,{
      //   roomId,
      //   username:location.state?.username,
      // });
    }
    init();
  },[])

  const [clients,setClients] = useState([
    {socketId : 1,username:"Kritarth V"},
    {socketId: 2,username:"John Doe"},
    {socketId: 3,username:"Jane Doe"},
  ]);
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className="logoImage" src='/logo.png' alt='logo'/>
          </div>
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
        <button className='btn copyBtn'>Copy Room ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor/>
      </div>
    </div>
  )
}

export default EditorPage

import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Editor from "../components/Editor"
import Client from "../components/Client"
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  const [clients,setClients] = useState([]);
 
  useEffect(()=>{
    const init = async ()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));
      function handleErrors(e){
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.')
        reactNavigator('/');
      }
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      });
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
      });
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room`);
        setClients((prev)=>{
          return prev.filter(client=>client.socketId !== socketId);
        })
      })
    }
    init();
    return ()=>{
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }
  },[])

  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied successfully!");
    } catch (error) {
      toast.error("Failed to copy Room ID!");
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if(!location.state){
    return <Navigate to='/'/>
  }
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
        <button className='btn copyBtn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId}/>
      </div>
    </div>
  )
}

export default EditorPage

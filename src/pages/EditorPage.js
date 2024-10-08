import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Editor from "../components/Editor"
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Output from '../components/Output';
import Aside from '../components/Aside';
import Bar from '../components/Bar';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  const [language,setLanguage] = useState("cpp");
  const [fontSize,setFontSize] = useState(18);
  const [theme,setTheme] = useState("dark");
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
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId,language})=>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
        setLanguage(language);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code:codeRef.current,
          socketId,
        })
        socketRef.current.emit(ACTIONS.SYNC_INPUT,{
          socketId,
          roomId,
        })
        socketRef.current.emit(ACTIONS.SYNC_OUTPUT,{
          socketId,
          roomId,
        })
      });
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE,({language})=>{
        setLanguage(language);
      })
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
      socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      socketRef.current.off(ACTIONS.INPUT_CHANGE);
      socketRef.current.off(ACTIONS.OUTPUT_CHANGE);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }
  },[])

  function leaveRoom() {
    reactNavigator("/");
  }

  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied successfully!");
    } catch (error) {
      toast.error("Failed to copy Room ID!");
    }
  }

  if(!location.state){
    return <Navigate to='/'/>
  }

  const handleLanguageChange = (event)=>{
    setLanguage(event.target.value);
  }

  const handleFontSizeChange = (event)=>{
    setFontSize(event.target.value);
  }

  const handleThemeChange = (event)=>{
    setTheme(event.target.value);
  }

  if(theme==="dark"){
    document.documentElement.style.setProperty('--background-color','#1c1e29');
    document.documentElement.style.setProperty('--text-color','#fff');
    document.documentElement.style.setProperty('--input-output-color','#282a36');
  } else {
    document.documentElement.style.setProperty('--background-color','#fff');
    document.documentElement.style.setProperty('--text-color','#000');
    document.documentElement.style.setProperty('--input-output-color','#f0f0f0');
  }
  return (
    <div className="mainWrap">
      <div className='asideEditorBarWrap'>
        <Bar
            handleLanguageChange={handleLanguageChange}
            fontSize={fontSize}
            handleFontSizeChange={handleFontSizeChange}
            theme={theme}
            handleThemeChange={handleThemeChange}
            clients={clients}
            leaveRoom={leaveRoom}
            copyRoomId={copyRoomId}
            
        />
        <div className='asideEditorWrap'>
          <Aside
            clients={clients}
            leaveRoom={leaveRoom}
            roomId={roomId}
            copyRoomId={copyRoomId}
          />
          <div className='editorWrap'>
            <Editor 
                socketRef={socketRef} 
                roomId={roomId} 
                onCodeChange={(code)=>{codeRef.current=code}}
                fontSize={fontSize}
                theme={theme}
                language={language}
            />
          </div>
        </div>
      </div>
      <div className='inputOutputWrap'>
        <Input 
            inputRef={inputRef}
            socketRef={socketRef}
            roomId={roomId}
        />
        <Output 
            socketRef={socketRef}
            roomId={roomId}
            inputRef={inputRef}
            codeRef={codeRef}
            language={language}
        />
      </div>
    </div>
  )
}

export default EditorPage
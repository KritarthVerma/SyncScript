import React, { useEffect } from 'react'
import Axios from 'axios'
import { useState } from 'react';
import ACTIONS from '../Actions';
import { useRef } from 'react';

const Output = ({socketRef,roomId,inputRef,codeRef,language}) => {
  const [output, setOutput] = useState("");
  const outputRef = useRef(output);
  const compileCode = ()=>{
    if(codeRef.current==="")return;
    Axios.post(`http://localhost:5001/compile`, {
            code: codeRef.current,
            language,
            input: inputRef.current
        }).then((res) => {
            outputRef.current = res.data.stdout || res.data.stderr;
            setOutput(res.data.stdout || res.data.stderr)
        }).catch((err) => {
            outputRef.current = "Error: " + err.response ? err.response.data.error : err.message;
            setOutput("Error: " + err.response ? err.response.data.error : err.message)
        });
  }
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.emit(ACTIONS.OUTPUT_CHANGE,{
        roomId,
        output,
      })
    }
  },[outputRef.current]);
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.OUTPUT_CHANGE,({output})=>{
        setOutput(output);
        outputRef.current = output;
      });
    }
  },[socketRef.current])
  const clearConsole = ()=>{
    outputRef.current="";
    setOutput("");
  }
  return (
    <div className='outputWrap'>
      <div className='outputHeading'>
        <h2>Output</h2>
      </div>
      <div className='outputConsole'>
        <textarea value={outputRef.current} className='code-output' readOnly></textarea>
      </div>
      <button 
          onClick={compileCode}
          className='runBtn btn'>
            Run
      </button>
      <button 
          onClick={clearConsole}
          className='clearBtn btn'>
            Clear
      </button>
    </div>
  )
}

export default Output

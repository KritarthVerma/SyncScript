import React, { useEffect, useState } from 'react'
import ACTIONS from '../Actions'

const Input = ({inputRef,socketRef,roomId}) => {
  const [input,setInput] = useState("");
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.INPUT_CHANGE,({input})=>{
        inputRef.current=input;
        setInput(input);
      })
    }
  },[socketRef.current])
  useEffect(()=>{
    if(socketRef.current){
      inputRef.current=input;
      socketRef.current.emit(ACTIONS.INPUT_CHANGE,{roomId,input:input})
    }
  },[input])
  return (
    <div className='inputWrap'>
      <div className='inputHeading'>
        <h2>Input</h2>
      </div>
      <div className='inputConsole'>
        <textarea
            value={input}
            onChange={(event)=>{setInput(event.target.value)}}
            className='code-input'>
        </textarea>
      </div>
    </div>
  )
}

export default Input

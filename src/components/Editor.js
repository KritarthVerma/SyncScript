import React, { useEffect,useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions'

const Editor = ({socketRef,roomId,onCodeChange,fontSize,theme,language}) => {
  const editorRef = useRef(null);
  useEffect(()=>{
    async function init() {
      const mode = getMode(language);
      editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"),{
        mode : mode,
        theme:`${theme === 'dark' ? 'dracula' : 'eclipse'}`,
        autoCloseTags:true,
        autoCloseBrackets:true,
        lineNumbers : true
      });
      editorRef.current.on('change',(instance,changes)=>{
        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin !== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{
            roomId,
            code,
          });
        }
      })
    }
    init();
    return ()=>{
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  },[])
  useEffect(()=>{
    if (editorRef.current) {
        const mode = getMode(language);
        editorRef.current.setOption('mode', { name: mode });
    }
  },[language])
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getWrapperElement().style.fontSize = `${fontSize}px`;
      editorRef.current.setOption('theme', theme === 'dark' ? 'dracula' : 'eclipse');
    }
  }, [fontSize,theme]);
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code !== null){
          editorRef.current.setValue(code);
        }
      })
    }
  },[socketRef.current]);
  function getMode(language){
    switch(language) {
      case 'java' : 
        return 'text/x-java';
      case 'cpp' : 
        return 'text/x-c++src';
      case 'c' : 
        return 'text/x-csrc';
      case 'python' : 
        return 'text/x-python';
      default : return 'text';
    }
  }
  return (
    <textarea id='realtimeEditor'>#Enter your code here</textarea>
  )
}

export default Editor

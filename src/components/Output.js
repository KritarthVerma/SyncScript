import React, { useEffect } from 'react'
import Axios from 'axios'
import { useState } from 'react';

const Output = ({inputRef,codeRef,language}) => {
  const [output, setOutput] = useState();
  const compileCode = ()=>{
    console.log(codeRef.current);
    if(codeRef.current==="")return;
    Axios.post(`http://localhost:5001/compile`, {
            code: codeRef.current,
            language,
            input: inputRef.current
        }).then((res) => {
            setOutput(res.data.stdout || res.data.stderr)
        }).catch((err) => {
            setOutput("Error: " + err.response ? err.response.data.error : err.message)
        });
  }

  const clearConsole = ()=>{
    setOutput("");
  }
  return (
    <div className='outputWrap'>
      <div className='outputHeading'>
        <h2>Output</h2>
      </div>
      <div className='outputConsole'>
        <textarea value={output} className='code-output' readOnly></textarea>
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

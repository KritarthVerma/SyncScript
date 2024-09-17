import React from 'react'

const Output = () => {
  return (
    <div className='outputWrap'>
      <div className='outputHeading'>
        <h2>Output</h2>
      </div>
      <div className='outputConsole'>
        <textarea className='code-output'></textarea>
      </div>
    </div>
  )
}

export default Output

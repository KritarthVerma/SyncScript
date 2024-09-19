import React from 'react'

const Input = ({onInputChange}) => {
  return (
    <div className='inputWrap'>
      <div className='inputHeading'>
        <h2>Input</h2>
      </div>
      <div className='inputConsole'>
        <textarea
            onChange={(event)=>{onInputChange(event.target.value)}}
            className='code-input'>

        </textarea>
      </div>
    </div>
  )
}

export default Input

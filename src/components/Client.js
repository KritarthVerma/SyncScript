import React from 'react'
import Avatar from "react-avatar"

const Client = ({key,username}) => {
  return (
    <div className='client'>
        <Avatar 
          name={username} 
          size={35} 
          round="50%"
        />
        <span className='userName'>{username}</span>
    </div>
  )
}

export default Client

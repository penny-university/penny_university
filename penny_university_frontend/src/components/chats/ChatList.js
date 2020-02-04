import React from 'react'
import ChatCard from './ChatCard'

const ChatList = ({ chats }) => (
  <div>
    {chats && chats.length
      ? chats.map((chat, i) => (
        <ChatCard chat={chat} key={i}/>
      )) : null
    }
  </div>
)

export default ChatList

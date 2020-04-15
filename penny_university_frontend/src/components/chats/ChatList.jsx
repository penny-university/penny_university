import React from 'react'
import ChatCard from './ChatCard'

const ChatList = ({ chats }) => (
  <div>
    {chats && chats.length
      ? chats.map((chat) => (
        <ChatCard chat={chat} key={`ChatCard-${chat.id}`} />
      )) : null}
  </div>
)

export default ChatList

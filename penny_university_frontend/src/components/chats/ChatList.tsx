import React from 'react'
import ChatCard from './ChatCard'

type ChatList = {
  chats: Array<Chat>,
}

const ChatList = ({ chats }: ChatList) => (
  <div>
    {chats && chats.length
      ? chats.map((chat) => (
        <ChatCard chat={chat} key={`ChatCard-${chat.id}`} />
      )) : null}
  </div>
)

export default ChatList

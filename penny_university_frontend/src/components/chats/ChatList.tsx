import React from 'react'
import ChatCard from './ChatCard'
import { Chat } from '../../models'

type ChatList = {
  chats: Array<number>,
  getChatByID: (id: number) => Chat,
}

const ChatList = ({ chats, getChatByID }: ChatList) => (
  <div>
    {chats && chats.length
      ? chats.map((chatID) => (
        <ChatCard chat={getChatByID(chatID)} key={`ChatCard-${chatID}`} />
      )) : null}
  </div>
)

export default ChatList

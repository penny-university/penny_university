import React from 'react'
import { ChatList } from '../components/index.ts'

const ChatsPage = () => (
  <ChatList filter={{ key: 'all', query: '' }} />
)

export default ChatsPage

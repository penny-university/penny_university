import React from 'react'
import { ChatList } from '../components'


const ChatsPage = () => (
  <ChatList filter={{key: 'all', query: ''}}/>
)

export default ChatsPage
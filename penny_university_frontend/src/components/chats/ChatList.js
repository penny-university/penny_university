import React from 'react';
import ChatCard from './ChatCard';
import chats from '../../mock_data/chats';

const ChatList = () => (
    <div>
      {chats && chats.length
        ? chats.map((chat, i) => (
          <ChatCard chat={chat} key={i}/>
        )) : null
      }
    </div>
);

export default ChatList;
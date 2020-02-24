import React from 'react'
import {Link} from 'react-router-dom'
import {
  Card,
  CardTitle
} from 'reactstrap'
import Date from '../Date'
import Content from '../Content'
import ParticipantList from './ParticipantList'

const ChatCard = ({chat}) => {
  return (
    <Card body className='mb-3 border-0 shadow-sm'>
      <CardTitle tag='h5'>
        <Link className='text-reset' to={`/chats/${chat.id}`}>{chat.title}</Link>
      </CardTitle>
      <Date className='text-secondary' date={chat.date}/>
      {chat.description ?
        <Content source={chat.description}/> : null
      }
      <div className='d-flex'>
        <ParticipantList className='mr-2' participants={chat.participants} chatId={chat.id}/>
        -
        <Link className='ml-2' to={`/chats/${chat.id}`}>
          Follow Ups
        </Link>
      </div>
    </Card>
  )
}

export default ChatCard

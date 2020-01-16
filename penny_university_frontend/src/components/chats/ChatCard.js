import React from 'react'
import {Link} from 'react-router-dom'
import {
  Card,
  CardTitle
} from 'reactstrap'
import Date from '../Date'
import Content from '../Content'

const ChatCard = ({chat}) => {
  return (
    <Card body className='mb-3 border-0 shadow-sm'>
      <CardTitle tag='h5'>
        <Link className='text-reset' to={`/chats/${chat.id}`}>{chat.title}</Link>
      </CardTitle>
      <Date date={chat.date}/>
      {chat.description ?
        <Content source={chat.description}/> : null
      }
      <Link to={`/chats/${chat.id}`}>
        {chat.followUpUrl} Follow Ups
      </Link>
    </Card>
  )
}

export default ChatCard
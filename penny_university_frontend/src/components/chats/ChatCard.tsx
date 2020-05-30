import React from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardTitle,
} from 'reactstrap'
import Date from '../Date'
import { Content } from '../content'
import ParticipantList from './ParticipantList'
import { Chat } from '../../models'


export const TestIDs = {
  chatCard: 'chart-card'
}

type ChatCardProps = {
  chat: Chat | undefined
}

const ChatCard = ({ chat }: ChatCardProps) =>
  chat ? (
    <Card body className="mb-3 border-0 shadow-sm" data-testid={TestIDs.chatCard}>
      <CardTitle tag="h5">
        <Link className="text-reset" to={`/chats/${chat.id}`}>{chat.title}</Link>
      </CardTitle>
      <Date className="text-secondary" date={chat.date} />
      {chat.description
        ? <Content content={chat.description} /> : null}
      <div className="d-flex">
        <ParticipantList className="mr-2" participants={chat.participants} chatID={chat.id} />
      -
      <Link className="ml-2" to={`/chats/${chat.id}`}>
          Follow Ups
      </Link>
      </div>
    </Card>
  ) : null


export default ChatCard

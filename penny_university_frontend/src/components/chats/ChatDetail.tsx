import React, { useEffect, useState } from 'react'
import { Card } from 'reactstrap'
import {
  CreateButton,
} from '../buttons'
import Date from '../Date'
import Content from '../content'
import { FollowUpCard } from '../follow-ups'
import modalDispatch from '../modal/dispatch'
import { Chat, FollowUp, User } from '../../models'
import { FollowUpType } from '../../models/followUp'
import ParticipantList from './ParticipantList'

require('./styles.scss')

interface ChatDetailProps {
  chat: Chat,
  followUps: Array<FollowUp>,
  createFollowUp: (id: number, content: { content: string }) => void,
  updateFollowUp: (followup: FollowUpType) => void,
  user: User,
  getUserByID: (id: number) => User,
}

const ChatDetail = ({
  chat, followUps, createFollowUp, updateFollowUp, user, getUserByID,
}: ChatDetailProps) => {
  const [addFollowUpMode, toggleAddFollowUpMode] = useState(false)

  const newFollowUpKey = `new-followup:${chat.id}`

  useEffect(() => {
    if (newFollowUpKey) {
      const saved = sessionStorage.getItem(newFollowUpKey)
      if (saved !== null) {
        toggleAddFollowUpMode(true)
      }
    }
  }, [toggleAddFollowUpMode, newFollowUpKey])

  const saveNewFollowUp = (text: string) => {
    if (user.valid) {
      createFollowUp(chat.id, { content: text })
      toggleAddFollowUpMode(false)
    } else {
      modalDispatch.auth()
    }
  }

  const cancelOnPress = () => {
    sessionStorage.removeItem(newFollowUpKey)
    toggleAddFollowUpMode(false)
  }

  const createOnPress = () => {
    if (user.valid) {
      Promise.resolve(toggleAddFollowUpMode(true))
        .then(() => window.scrollTo(0, document.body.scrollHeight))
    } else {
      modalDispatch.auth()
    }
  }

  /*
   * Scrolls to the top of the page when the component is mounted.
   * Sticky navbar causes a bug that keeps the scroll
   * position when navigating to the chat detail.
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (chat.valid) {
    return (
      <Card body className="mb-3 border-0 shadow-sm">
        <div className="chat-detail-header">
          <h3 className="mr-3">{chat.title}</h3>
        </div>
        <Date className="text-secondary" date={chat.formattedDate} />
        {chat.description ? <Content className="mb-4" content={chat.description} /> : null}
        <div className="mb-4">
          <CreateButton type="Follow Up" onClick={createOnPress} />
        </div>
        <div className="d-flex">
          <ParticipantList className="mr-2 h5" participants={chat.participants} chatID={chat.id} getUserByID={getUserByID} />
          <h5>-</h5>
          <h5 className="mb-3 ml-2">
            {followUps.length}
            {' '}
            Follow Ups
          </h5>
        </div>
        {followUps.map((followUp) => {
          const followUpUser = getUserByID(followUp.user)
          const role = chat.getUserRole(followUp.user)
          return (
            <FollowUpCard
              key={`FollowUpCard-${followUp.id}`}
              followUp={followUp}
              updateFollowUp={updateFollowUp}
              user={followUpUser}
              role={role}
              canEdit={user?.id === followUpUser?.id}
            />
          )
        })}
        <hr />
        {addFollowUpMode
          ? (
            <div>
              <h5>Add New Follow Up:</h5>
              <Content edit content={''} saveFollowUp={saveNewFollowUp} cancelFollowUp={cancelOnPress} storageKey={newFollowUpKey} />
            </div>
          )
          : <CreateButton type="Follow Up" onClick={createOnPress} />}
      </Card>
    )
  }
  return <h1>Loading...</h1>
}

export default ChatDetail

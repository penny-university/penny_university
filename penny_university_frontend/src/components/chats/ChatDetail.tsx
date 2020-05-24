import React, { useEffect, useState } from 'react'
import { Card } from 'reactstrap'
import {
  HeartButton, CreateButton, SaveButton, CancelButton,
} from '../buttons'
import Date from '../Date'
import { Content, EditContent } from '../content'
import { FollowUpCard } from '../follow-ups'
import modalDispatch from '../modal/dispatch'
import { Chat, User } from '../../models'

require('./styles.scss')

interface ChatDetailProps {
  chat: Chat,
  followUps: Array<FollowUp>,
  createFollowUp: (id: number, content: { content: string }) => void,
  updateFollowUp: (followup: FollowUp) => void,
  user: User,
  getUserByID: (id: number) => User,
}

const ChatDetail = ({
  chat, followUps, createFollowUp, updateFollowUp, user, getUserByID
}: ChatDetailProps) => {
  const [addFollowUpMode, toggleAddFollowUpMode] = useState(false)
  const [followUpContent, updateFollowUpContent] = useState('')

  const saveNewFollowUp = () => {
    createFollowUp(chat.id, { content: followUpContent })
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
        <Date className="text-secondary" date={chat.date} />
        {chat.description ? <Content className="mb-4" content={chat.description} /> : null}
        <div className="mb-4">
          <HeartButton className="mr-2" count={followUps.length} />
          <CreateButton type="Follow Up" onClick={createOnPress} />
        </div>
        <h5 className="mb-3">
          {followUps.length}
          {' '}
          Follow Ups
        </h5>
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
              <EditContent content={followUpContent} onChange={updateFollowUpContent} />
              <div className="mt-2">
                <SaveButton type="Follow Up" onClick={saveNewFollowUp} />
                <CancelButton className="ml-2" onClick={() => toggleAddFollowUpMode(false)} />
              </div>
            </div>
          )
          : <CreateButton type="Follow Up" onClick={createOnPress} />}
      </Card>
    )
  }
  return <h1>Loading...</h1>
}

export default ChatDetail

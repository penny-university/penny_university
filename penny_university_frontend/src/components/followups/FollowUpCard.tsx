import React, { useState } from 'react'
import { Content, EditContent } from '../content'
import { EditButton, SaveButton } from '../buttons'
import FollowUpUserInfo from './FollowUpUserInfo'
import { User } from '../../models'

type FollowUpCard = {
  followUp: FollowUp,
  updateFollowUp: (followUp: FollowUp) => void,
  canEdit: boolean,
  user: User,
  role: 'Organizer' | 'Participant' | ''
}

const FollowUpButtons = ({ editOnPress, saveOnPress, editMode }: { editOnPress: () => void, saveOnPress: () => void, editMode: boolean }) => editMode
  ? <SaveButton className="align-self-start" type="Changes" onClick={saveOnPress} />
  : <EditButton className="align-self-start" type="Follow Up" onClick={editOnPress} />

const FollowUpCard = ({ followUp, updateFollowUp, canEdit, user, role }: FollowUpCard) => {
  const [editMode, toggleEditMode] = useState(false)
  const [content, updateContent] = useState(followUp.content)

  const saveFollowUp = () => {
    const fllwUp = { ...followUp }
    fllwUp.content = content
    updateFollowUp(fllwUp)
    updateFollowUp(followUp)
    toggleEditMode(false)
  }

  const editOnPress = () => toggleEditMode(true)
  return (
    <div className="pt-2">
      <div className="d-flex justify-content-between">
        <FollowUpUserInfo user={user} date={followUp.date} role={role}  />
        {canEdit ? <FollowUpButtons editMode={editMode} saveOnPress={saveFollowUp} editOnPress={editOnPress} /> : null}
      </div>
      {editMode
        ? <EditContent content={content} onChange={updateContent} />
        : <Content className="ml-4 border-left pl-3" content={content} />}
    </div>
  )
}

export default FollowUpCard
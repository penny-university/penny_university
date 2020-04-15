import React, { useState } from 'react'
import { Content, EditContent } from '../content'
import { EditButton, SaveButton } from '../buttons'
import FollowUpUserInfo from './FollowUpUserInfo'

const FollowUpCard = ({ followUp, updateFollowUp }) => {
  const [editMode, toggleEditMode] = useState(false)
  const [content, updateContent] = useState(followUp.content)

  const saveFollowUp = () => {
    const fllwUp = { ...followUp }
    fllwUp.content = content
    updateFollowUp(fllwUp)
    updateFollowUp(followUp)
    toggleEditMode(false)
  }

  return (
    <div className="pt-2">
      <div className="d-flex justify-content-between">
        <FollowUpUserInfo userProfile={followUp.userProfile} date={followUp.date} />
        {editMode
          ? <SaveButton className="align-self-start" type="Changes" onClick={saveFollowUp} />
          : <EditButton className="align-self-start" type="Follow Up" onClick={() => toggleEditMode(true)} />}
      </div>
      {editMode
        ? <EditContent content={content} onChange={updateContent} />
        : <Content className="ml-4 border-left pl-3" content={content} />}
    </div>
  )
}

export default FollowUpCard

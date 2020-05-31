import React, { useState } from 'react'
import { FollowUp, User } from '../../models'
import { Dropdown } from '../../components'
import { Content, EditContent } from '../content'
import { EditButton, SaveButton } from '../buttons'
import FollowUpUserInfo from './FollowUpUserInfo'


export const TestIDs ={
  subMenu: 'followup-submenu'
}

type FollowUpCard = {
  followUp: FollowUp,
  updateFollowUp: (followUp: FollowUp) => void,
  canEdit: boolean,
  user: User,
  role: 'Organizer' | 'Participant' | ''
}

const FollowUpButtons = ({ editOnPress, saveOnPress, editMode, id }: { editOnPress: () => void, saveOnPress: () => void, editMode: boolean, id: number }) => editMode
  ? <SaveButton className="align-self-start" type="Changes" onClick={saveOnPress} />
  : <Dropdown
    id={`followup-dropdown-${id}`}
    header="Options"
    testID={TestIDs.subMenu}
    options={[
      <EditButton className="align-self-start" type="Follow Up" onClick={editOnPress} key={`edit-followup-${id}`} color="link" />,
    ]}
  />

const FollowUpCard = ({ followUp, updateFollowUp, canEdit, user, role }: FollowUpCard) => {
  const [editMode, toggleEditMode] = useState(false)
  const [content, updateContent] = useState(followUp.content)

  const saveFollowUp = () => {
    const fllwUp = new FollowUp({ ...followUp })
    fllwUp.content = content
    updateFollowUp(fllwUp)
    toggleEditMode(false)
  }

  const editOnPress = () => toggleEditMode(true)
  return (
    <div className="pt-2">
      <div className="d-flex justify-content-between">
        <FollowUpUserInfo user={user} date={followUp.formattedDate} role={role} />
        {canEdit ? <FollowUpButtons id={followUp.id} editMode={editMode} saveOnPress={saveFollowUp} editOnPress={editOnPress} /> : null}
      </div>
      {editMode
        ? <EditContent content={content} onChange={updateContent} />
        : <Content className="ml-4 border-left pl-3" content={content} />}
    </div>
  )
}

export default FollowUpCard

import React, { useState } from 'react'
import { DropdownItem } from 'reactstrap';
import {
  faTrash, faPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FollowUp, User } from '../../models'
import { FollowUpType } from '../../models/followUp'
import { Dropdown } from '..'
import Content from '../content'
import FollowUpUserInfo from './FollowUpUserInfo'
import modalDispatch from '../modal/dispatch'

export const TestIDs = {
  subMenu: 'followup-submenu',
}

type FollowUpCard = {
  followUp: FollowUp,
  updateFollowUp: (followUp: FollowUpType) => void,
  canEdit: boolean,
  user: User,
  role: 'Organizer' | 'Participant' | ''
}

const FollowUpButtons = ({
  confirmDeleteOnPress, editOnPress, id,
}: {
  confirmDeleteOnPress: () => void, editOnPress: () => void, id: number
}) => (
  <Dropdown
    id={`followup-dropdown-${id}`}
    header="Options"
    testID={TestIDs.subMenu}
    options={[
      <DropdownItem
        className="btn btn-link"
        onClick={editOnPress}
        key={`edit-followup-${id}`}
      >
        <FontAwesomeIcon icon={faPen} className="mr-2" />
        Edit
      </DropdownItem>,
      <DropdownItem
        className="btn btn-link"
        onClick={confirmDeleteOnPress}
        key={`delete-followup-${id}`}
      >
        <FontAwesomeIcon icon={faTrash} className="mr-2" />
        Delete
      </DropdownItem>,
    ]}
  />
)

const FollowUpCard = ({
  followUp, updateFollowUp, canEdit, user, role,
}: FollowUpCard) => {
  const [editMode, toggleEditMode] = useState(false)

  const saveFollowUp = (text: string) => {
    const fllwUp = { ...followUp }
    fllwUp.content = text
    updateFollowUp(fllwUp)
    toggleEditMode(false)
  }

  const storageKey = `${followUp.id}:${followUp.pennyChat}`
  const editOnPress = () => toggleEditMode(true)
  const cancelOnPress = () => toggleEditMode(false)
  const confirmDeleteOnPress = () => {
    modalDispatch.confirmDeleteFollowUp(followUp.id, Number(followUp.pennyChat))
  }
  return (
    <div className="pt-2">
      <div className="d-flex justify-content-between">
        <FollowUpUserInfo user={user} date={followUp.formattedDate} role={role} />
        {canEdit ? (
          <FollowUpButtons
            id={followUp.id}
            editOnPress={editOnPress}
            confirmDeleteOnPress={confirmDeleteOnPress}
          />
        ) : null}
      </div>
      <Content
        className="ml-4 border-left pl-3"
        content={followUp.content} 
        edit={editMode} 
        storageKey={storageKey}
        saveFollowUp={saveFollowUp}
        cancelFollowUp={cancelOnPress}
        />
    </div>
  )
}

export default FollowUpCard

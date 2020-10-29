import React, { useState } from 'react'
import { DropdownItem } from 'reactstrap'
import {
  faTrash, faPen,
} from '@fortawesome/free-solid-svg-icons'
import { FollowUp, User } from '../../models'
import { FollowUpType } from '../../models/followUp'
import { Dropdown } from '..'
import Content from '../content'
import FollowUpUserInfo from './FollowUpUserInfo'
import modalDispatch from '../modal/dispatch'
import { Strings } from '../../constants'

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
      options={[{
        onClick: editOnPress, icon: faPen, text: Strings.General.edit, key: id
      },
      {
        onClick: confirmDeleteOnPress, icon: faTrash, text: Strings.General.delete, key: id
      },
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

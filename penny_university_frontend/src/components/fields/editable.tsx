import React from 'react'
import Input from './input'
import { Strings } from '../../constants'
import { Dropdown } from '..'
import {
  faTrash, faPen,
} from '@fortawesome/free-solid-svg-icons'

export const EditTitleButtons = ({
  editOnPress, id,
}: {
  editOnPress: () => void, id: number
}) => (
    <Dropdown
      id={`chatTitle-dropdown-${id}`}
      header="Options"
      options={[{
        onClick: editOnPress, icon: faPen, text: Strings.General.edit, key: id
      },
      ]}
    />
  )

const EditableInput = () => {
  return Input
}

export default EditableInput

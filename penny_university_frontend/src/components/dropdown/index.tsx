import React, { useState } from 'react'
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { MoreOptions } from '../buttons'

interface Option {
  onClick: () => void,
  icon: FontAwesomeIconProps["icon"],
  text: string,
  key: string | number,
}

interface DropdownProps {
  header: string,
  options: Array<Option>,
  id: string,
  testID?: string | undefined,
}

const CustomDropdown = ({
  header, options, id, testID,
}: DropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => {
    setDropdownOpen((prevState) => !prevState)
  }

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag="span">
        <MoreOptions id={id} testID={testID} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>{header}</DropdownItem>
        <DropdownItem divider />
        {options.map(({onClick, icon, text, key}) => <DropdownItem
        className="btn btn-link"
        onClick={onClick}
        key={`edit-followup-${key}`}
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {text}
      </DropdownItem>)}
      </DropdownMenu>
    </Dropdown>
  )
}

export default CustomDropdown

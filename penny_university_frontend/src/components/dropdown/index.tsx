import React, { useState } from 'react'
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap'
import { MoreOptions } from '../buttons'

interface DropdownProps {
  header: string,
  options: Array<React.ReactElement>,
  id: string,
  testID: string,
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
        {options}
      </DropdownMenu>
    </Dropdown>
  )
}

export default CustomDropdown

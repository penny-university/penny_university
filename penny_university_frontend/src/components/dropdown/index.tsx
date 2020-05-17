import React from 'react'
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import { MoreOptions } from '../buttons'

interface DropdownProps {
  header: string,
  options: Array<React.ReactElement>,
  id: string,
}

const Dropdown = ({ header, options, id }: DropdownProps) => {
  return (
    <>
      <MoreOptions id={id} />
      <UncontrolledPopover trigger="legacy" placement="bottom" target={id}>
        <PopoverHeader>{header}</PopoverHeader>
        {options}
      </UncontrolledPopover>
    </>
  )
}

export default Dropdown

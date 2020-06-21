import React from 'react'
import { UncontrolledPopover, PopoverHeader } from 'reactstrap'
import { MoreOptions } from '../buttons'

interface DropdownProps {
  header: string,
  options: Array<React.ReactElement>,
  id: string,
  testID: string,
}

const Dropdown = ({ header, options, id, testID }: DropdownProps) => {
  return (
    <>
      <MoreOptions id={id} testID={testID} />
      <UncontrolledPopover trigger="legacy" placement="bottom" target={id}>
        <PopoverHeader>{header}</PopoverHeader>
        {options}
      </UncontrolledPopover>
    </>
  )
}

export default Dropdown

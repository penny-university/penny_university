import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { Link } from 'react-router-dom'
import * as selectors from '../../selectors'
import { RootState } from '../../reducers'
import User from '../../models/user'

type ParticipantListProps = {
  className: string,
  participants: Array<Participant>,
  chatID: number,
  getUserByID: (id: number) => User,
}

const ParticipantList = ({ className, participants, chatID, getUserByID }: ParticipantListProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const openPopover = () => setPopoverOpen(true)

  const closePopover = () => setPopoverOpen(false)

  const DISPLAYED_PARTICIPANTS = 5

  return (
    <div className={`${className} d-inline-flex`}>
      <Link
        to={`/chats/${chatID}`}
        id={`ParticipantsPopover${chatID}`}
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
      >
        {participants.length}
        {' '}
        {participants.length > 1 ? 'Participants' : 'Participant'}
      </Link>
      <Popover placement="right-start" isOpen={popoverOpen} target={`ParticipantsPopover${chatID}`} trigger="hover">
        <PopoverHeader>Participants</PopoverHeader>
        <PopoverBody>
          {participants.slice(0, DISPLAYED_PARTICIPANTS).map((p) => (
            <p key={p.user} className="mb-0">
              {console.log(getUserByID(p.user), p)}
              {getUserByID(p.user).displayName}
              {p.role === 'Organizer' ? ` - ${p.role}` : ''}
            </p>
          ))}
          {participants.length > DISPLAYED_PARTICIPANTS
            ? (
              <p className="mb-0">
                and
                {' '}
                {participants.length - DISPLAYED_PARTICIPANTS}
                {' '}
                others
              </p>
            ) : null}
        </PopoverBody>
      </Popover>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  getUserByID: (id: string) => selectors.entities.getUserByID(state, id),
})
// @ts-ignore
export default connect(mapStateToProps)(ParticipantList)

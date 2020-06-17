import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Date from '../Date.tsx'
import { User } from '../../models/index.ts'
import { Routes } from '../../constants/index.ts'

type FollowUpUserInfo = {
  user: User,
  date: string,
  role: 'Organizer' | 'Participant' | ''
}

const FollowUpUserInfo = ({ date, user, role }: FollowUpUserInfo) => (
  <div className="d-flex">
    <div className="bg-secondary mr-2 icon__user">
      <FontAwesomeIcon color="white" size="lg" icon={faUser} />
    </div>
    <div>
      <h6>
        <Link
          to={Routes.Profile.replace(':id', user.id.toString())}
        >
          {user.displayName}
        </Link>
        {role === 'Organizer' ? ` - ${role}` : ''}
      </h6>
      <Date className="text-secondary" date={date} />
    </div>
  </div>
)

export default FollowUpUserInfo

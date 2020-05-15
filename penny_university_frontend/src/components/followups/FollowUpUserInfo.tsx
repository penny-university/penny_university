import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Date from '../Date'

type FollowUpUserInfo = {
  userProfile: UserProfile,
  date: string,
}

const FollowUpUserInfo = ({ userProfile, date }: FollowUpUserInfo) => (
  <div className="d-flex">
    <div className="bg-secondary mr-2 icon__user">
      <FontAwesomeIcon color="white" size="lg" icon={faUser} />
    </div>
    <div>
      <h6>
        {userProfile.realName}
        {userProfile.role === 'Organizer' ? ` - ${userProfile.role}` : ''}
      </h6>
      <Date className="text-secondary" date={date} />
    </div>
  </div>
)

export default FollowUpUserInfo

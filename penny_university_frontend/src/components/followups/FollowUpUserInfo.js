import React from 'react'
import Date from '../Date'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'

const FollowUpUserInfo = ({user, date}) => (
  <div className='d-flex'>
    <div className='bg-secondary mr-2 icon__user'>
      <FontAwesomeIcon color='white' size='lg' icon={faUser}/>
    </div>
    <div>
      <h6>{user.realName}{user.role === 'Organizer' ? ' - ' + user.role : ''}</h6>
      <Date className='text-secondary' date={date}/>
    </div>
  </div>
)

export default FollowUpUserInfo

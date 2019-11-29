import React from 'react';
import Content from '../Content';
import FollowUpUserInfo from "./FollowUpUserInfo";

const FollowUpCard = ({followUp}) => {
  return (
    <div className='pt-2'>
      <FollowUpUserInfo user={followUp.user} date={followUp.date}/>
      <Content content={followUp.content}/>
    </div>
  )
};

export default FollowUpCard;
import React from 'react';
import {useParams} from 'react-router-dom';
import chats from '../../mock_data/chats';
import {FollowUpCard} from '../followups';
import {HeartButton, CreateButton} from '../buttons';
import {Card} from "reactstrap";
import Date from '../Date';

const ChatDetail = () => {
  let {id} = useParams();
  const chat = chats.find(c => c.id == id);

  return (
    <Card body className='mb-3 border-0 shadow-sm'>
      <div className='row'>
        <h3 className='col-md-8'>{chat.title}</h3>
        <div className='col-md-4 d-flex justify-content-end align-items-start'>
          <HeartButton className='mr-2' count={chat.followups.length}/>
          <CreateButton type='Follow Up'/>
        </div>
      </div>
      <Date date={chat.date}/>
      <h5>{chat.followups.length} Follow Ups</h5>
      <hr/>
      {chat.followups.map((followUp, i) => <FollowUpCard key={i} followUp={followUp}/>)}
    </Card>
  )
};

export default ChatDetail;
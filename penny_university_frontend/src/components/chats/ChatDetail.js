import React, {useEffect} from 'react'
import {HeartButton, CreateButton} from '../buttons'
import {Card} from 'reactstrap'
import Date from '../Date'
import Content from '../Content'
import {FollowUpCard} from '../followups'

const ChatDetail = ({chat, followUps}) => {
  /*
   * Scrolls to the top of the page when the component is mounted. Sticky navbar causes a bug that keeps the scroll
   * position when navigating to the chat detail.
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (chat) {
    return (
      <Card body className='mb-3 border-0 shadow-sm'>
        <h3 className='mr-3'>{chat.title}</h3>
        <Date className='text-secondary' date={chat.date}/>
        {chat.description ? <Content className='mb-4' source={chat.description}/> : null}
        <div className='mb-4'>
          <HeartButton className='mr-2' count={followUps.length}/>
          <CreateButton type='Follow Up'/>
        </div>
        <h5 className="mb-3">{followUps.length} Follow Ups</h5>
        {followUps.map((followUp, i) => <FollowUpCard key={i} followUp={followUp}/>)}
      </Card>
    )
  } else {
    return <h1>Loading...</h1>
  }
}

export default ChatDetail

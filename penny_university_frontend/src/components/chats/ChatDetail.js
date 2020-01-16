import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import chats from '../../mock_data/chats'
import {FollowUpCard} from '../followups'
import {HeartButton, CreateButton} from '../buttons'
import {Card} from 'reactstrap'
import Date from '../Date'
import Content from '../Content'

const ChatDetail = () => {
  let {id} = useParams()
  const chat = chats.find(c => c.id == id)

  /*
   * Scrolls to the top of the page when the component is mounted. Sticky navbar causes a bug that keeps the scroll
   * position when navigating to the chat detail.
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Card body className='mb-3 border-0 shadow-sm'>
      <h3 className='mr-3'>{chat.title}</h3>
      <Date date={chat.date}/>
      {chat.description ? <Content className='mb-4' source={chat.description}/> : null}
      <div className='mb-4'>
        <HeartButton className='mr-2' count={chat.followups.length}/>
        <CreateButton type='Follow Up'/>
      </div>
      <h5 class="mb-3">{chat.followups.length} Follow Ups</h5>
      {chat.followups.map((followUp, i) => <FollowUpCard key={i} followUp={followUp}/>)}
    </Card>
  )
}

export default ChatDetail
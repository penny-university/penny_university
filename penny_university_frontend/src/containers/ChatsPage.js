import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {loadChatsList} from '../actions'
import {ChatList} from '../components/chats'
import {Button} from 'reactstrap'

const ChatsPage = ({filteredChats, nextPageUrl, loadChatsList}) => {
  useEffect(() => {
    loadChatsList('all')
  }, [loadChatsList])
  return (
    <div>
      <ChatList chats={filteredChats}/>
      <Button className='mb-3' onClick={(e) => loadChatsList('all', nextPageUrl, e)}>Load More</Button>
    </div>
  )
}

ChatsPage.propTypes = {
  filteredChats: PropTypes.array.isRequired,
  loadChatsList: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    pagination: {chatsByFilter},
    entities: {chats, userProfiles}
  } = state

  const chatsPagination = chatsByFilter['all'] || {ids: []}
  const {nextPageUrl} = chatsPagination
  const filteredChats = chatsPagination.ids
    .map(id => chats[id])
    .map(c => {
      c.participants = c.participants.map(c => {
        // if userProfile is just an ID, populate the full userProfile
        return (typeof(c.userProfile) === 'number') ? {userProfile: userProfiles[c.userProfile], role: c.role} : c
      }).sort((a, b) => {
        if (a.role === 'Organizer') return -1
        else if (b.role === 'Organizer') return -1
        else return 0
      })
      return c
    })

  return {
    filteredChats,
    nextPageUrl
  }
}

const mapDispatchToProps = {
  loadChatsList: loadChatsList
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsPage))

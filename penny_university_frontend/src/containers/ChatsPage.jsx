import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import { loadChatsList } from '../actions'
import { ChatList } from '../components/chats'

const ChatsPage = ({ filteredChats, nextPageUrl, loadChatsList }) => {
  useEffect(() => {
    loadChatsList('all')
  }, [loadChatsList])
  return (
    <div>
      <ChatList chats={filteredChats} />
      <Button className="mb-3" onClick={(e) => loadChatsList('all', nextPageUrl, e)}>Load More</Button>
    </div>
  )
}

ChatsPage.propTypes = {
  filteredChats: PropTypes.array.isRequired,
  loadChatsList: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  const {
    pagination: { chatsByFilter },
    entities: { chats, users },
  } = state

  const chatsPagination = chatsByFilter.all || { ids: [] }
  const { nextPageUrl } = chatsPagination
  const filteredChats = chatsPagination.ids
    .map((id) => chats[id])
    .map((chat) => {
      const c = chat
      // if user is just an ID, populate the full user
      c.participants = c.participants.map((c) => ((typeof (c.user) === 'number') ? { user: users[c.user], role: c.role } : c)).sort((a, b) => {
        if (a.role === 'Organizer') return -1
        if (b.role === 'Organizer') return -1
        return 0
      })
      return c
    })

  return {
    filteredChats,
    nextPageUrl,
  }
}

const mapDispatchToProps = {
  loadChatsList,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsPage))

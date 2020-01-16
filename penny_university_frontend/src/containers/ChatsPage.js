import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {loadChats} from '../actions'
import {ChatList} from '../components/chats'

const ChatsPage = ({filteredChats, loadChats}) => {
  useEffect(() => {
    loadChats('all')
  }, [])
  return (
    <ChatList chats={filteredChats}/>
  )
}

ChatsPage.propTypes = {
  chats: PropTypes.array.isRequired,
  loadChats: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {

  const {
    pagination: {chatsByFilter},
    entities: {chats}
  } = state

  const chatsPagination = chatsByFilter['all'] || {ids: []}
  const filteredChats = chatsPagination.ids.map(id => chats[id])

  return {
    filteredChats
  }
}

export default withRouter(connect(mapStateToProps, {
  loadChats
})(ChatsPage))
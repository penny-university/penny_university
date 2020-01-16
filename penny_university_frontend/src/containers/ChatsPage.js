import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {loadChats} from '../actions'
import {ChatList} from '../components/chats'
import {Button} from 'reactstrap'

const ChatsPage = ({filteredChats, nextPageUrl, loadChats}) => {
  useEffect(() => {
    loadChats('all')
  }, [])
  return (
    <div>
      <ChatList chats={filteredChats}/>
      <Button className='mb-3' onClick={(e) => loadChats('all', nextPageUrl, e)}>Load More</Button>
    </div>
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
  const { nextPageUrl } = chatsPagination
  const filteredChats = chatsPagination.ids.map(id => chats[id])

  return {
    filteredChats,
    nextPageUrl
  }
}

export default withRouter(connect(mapStateToProps, {
  loadChats
})(ChatsPage))
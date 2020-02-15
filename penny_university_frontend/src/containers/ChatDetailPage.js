import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {loadChatDetail, loadFollowUps} from '../actions'
import {ChatDetail} from '../components/chats'

const ChatDetailPage = ({id, chat, followUpsList, loadChatDetail, loadFollowUps}) => {
  useEffect(() => {
    loadChatDetail(id)
    loadFollowUps(id)
  }, [id, loadChatDetail, loadFollowUps])

  return (
    <ChatDetail chat={chat} followUps={followUpsList}/>
  )
}

ChatDetailPage.propTypes = {
  id: PropTypes.string.isRequired,
  chat: PropTypes.object.isRequired,
  followUpsList: PropTypes.array.isRequired,
  loadChatDetail: PropTypes.func.isRequired,
  loadFollowUps: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const {id} = ownProps.match.params

  const {
    entities: {chats, followUps, users},
    pagination
  } = state

  const chat = chats[id]
  const followUpsPagination = pagination.followUpsByChat[id] || {ids: []}
  let followUpsList = followUpsPagination.ids.map(id => {
    let followUp = followUps[id]
    followUp.userInfo = users[followUp.user]
    return followUp
  })

  return {
    id,
    chat,
    followUpsList
  }
}

const mapDispatchToProps = {
  loadChatDetail,
  loadFollowUps
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatDetailPage))

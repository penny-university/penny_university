import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {createFollowUp, loadChatDetail, loadFollowUps, updateFollowUp} from '../actions'
import {ChatDetail} from '../components/chats'

const ChatDetailPage = ({id, chat, followUpsList, loadChatDetail, loadFollowUps, createFollowUp, updateFollowUp}) => {
  useEffect(() => {
    loadChatDetail(id)
    loadFollowUps(id)
  }, [id, loadChatDetail, loadFollowUps])

  return (
    <ChatDetail
      chat={chat}
      followUps={followUpsList}
      loadFollowUps={loadFollowUps}
      createFollowUp={createFollowUp}
      updateFollowUp={updateFollowUp}/>
  )
}

ChatDetailPage.propTypes = {
  id: PropTypes.string.isRequired,
  chat: PropTypes.object,
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

  let chat = chats[id]
  if (chat) {
    chat.participants = chat.participants.map(c => {
      // if user is just an ID, populate the full user
      return (typeof (c.user) === 'number') ? {user: users[c.user], role: c.role} : c
    })
  }
  const followUpsPagination = pagination.followUpsByChat[id] || {ids: []}

  const decorateUserWithRole = (user) => {
    if (chat) {
      let participant = chat.participants.find(p => p.user.id === user.id)
      return participant ? participant.role : null
    } else {
      return null
    }
  }

  let followUpsList = followUpsPagination.ids.map(id => {
    let followUp = followUps[id]
    followUp.userInfo = Object.assign({}, users[followUp.user], {
      role: decorateUserWithRole(users[followUp.user])
    })
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
  loadFollowUps,
  createFollowUp,
  updateFollowUp
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatDetailPage))

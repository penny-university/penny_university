import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  createFollowUp, loadChatDetail, loadFollowUps, updateFollowUp,
} from '../actions'
import { ChatDetail } from '../components/chats'
import * as selectors from '../selectors'

const ChatDetailPage = ({
  id, chat, followUpsList, loadChatDetail, loadFollowUps, createFollowUp, updateFollowUp, user, userProfiles
}) => {
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
      updateFollowUp={updateFollowUp}
      user={user}
      userProfiles={userProfiles}
    />
  )
}

ChatDetailPage.propTypes = {
  id: PropTypes.string.isRequired,
  chat: PropTypes.object,
  followUpsList: PropTypes.array.isRequired,
  loadChatDetail: PropTypes.func.isRequired,
  loadFollowUps: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params
  return {
    id,
    chat: selectors.chats.getChatById(state, id),
    followUpsList: selectors.chats.getFollowupsForChatId(state, id),
    user: selectors.user.getUser(state),
    userProfiles: selectors.entities.getUserProfiles(state),
  }
}

const mapDispatchToProps = {
  loadChatDetail,
  loadFollowUps,
  createFollowUp,
  updateFollowUp,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatDetailPage))

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  createFollowUp, loadChatDetail, loadFollowUps, updateFollowUp,
} from '../actions'
import { ChatDetail } from '../components/chats'
import * as selectors from '../selectors'
import { RootState } from '../reducers'


type StateProps = {
  id: string,
  chat: Chat,
  followUpsList: Array<FollowUp>,
  user: User,
  userProfiles: {[id: string]: UserProfile},
}

type DispatchProps = {
  loadChatDetail: (id: string) => void,
  loadFollowUps: (id: string) => void,
  createFollowUp: () => void,
  updateFollowUp: (followup: FollowUp) => void,
}

type ChatDetailPageProps = {
  match: { params: { id: string } }
} & DispatchProps & StateProps

const ChatDetailPage = ({
  id, chat, followUpsList, loadChatDetail, loadFollowUps, createFollowUp, updateFollowUp, user, userProfiles,
}: ChatDetailPageProps) => {
  useEffect(() => {
    loadChatDetail(id)
    loadFollowUps(id)
  }, [id, loadChatDetail, loadFollowUps])

  return (
    <ChatDetail
      chat={chat}
      followUps={followUpsList}
      createFollowUp={createFollowUp}
      updateFollowUp={updateFollowUp}
      user={user}
      userProfiles={userProfiles}
    />
  )
}

const mapStateToProps = (state: RootState, ownProps: ChatDetailPageProps) => {
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
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatDetailPage))

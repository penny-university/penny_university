import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  createFollowUp, loadChatDetail, loadFollowUps, updateFollowUp,
} from '../actions'
import { ChatDetail } from '../components/chats'
import { RootState } from '../reducers'


type StateProps = {
  id: string,
  chat: Chat,
  followUpsList: Array<FollowUp>,
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
  id, chat, followUpsList, loadChatDetail, loadFollowUps, createFollowUp, updateFollowUp,
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
    />
  )
}

const mapStateToProps = (state: RootState, ownProps: ChatDetailPageProps) => {
  const { id } = ownProps.match.params

  const {
    entities: { chats, followUps, userProfiles },
    pagination,
  } = state

  const chat = chats[id]
  if (chat) {
    // if userProfile is just an ID, populate the full userProfile
    chat.participants = chat.participants.map((c: Participant) => ((typeof (c.userProfile) === 'number') ? { userProfile: userProfiles[c.userProfile], role: c.role } : c))
  }
  // @ts-ignore
  const followUpsPagination = pagination.followUpsByChat[id] || { ids: [] }

  const decorateUserProfileWithRole = (userProfile: UserProfile) => {
    if (chat && userProfile) {
      
      const participant = chat.participants.find((p: Participant) => p.userProfile?.id === userProfile?.id)
      return participant ? participant.role : null
    }
    return null
  }

  const followUpsList = followUpsPagination.ids.map((id: string) => {
    const followUp = followUps[id]
    
    followUp.userProfile = {
      // @ts-ignore
      ...userProfiles[followUp.userProfile],
      // @ts-ignore
      role: decorateUserProfileWithRole(userProfiles[followUp.userProfile]),
    }
    return followUp
  })

  return {
    id,
    chat,
    followUpsList,
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

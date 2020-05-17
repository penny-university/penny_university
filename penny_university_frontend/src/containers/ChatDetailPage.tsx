import React, { useEffect } from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  createFollowUp, loadChatDetail, loadFollowUps, updateFollowUp, deleteFollowUp as deleteFollowUpAC, deleteChat as deleteChatAC,
} from '../actions'
import { ChatDetail } from '../components/chats'
import * as selectors from '../selectors'
import { RootState } from '../reducers'
import { Chat, User } from '../models'

type StateProps = {
  id: number,
  chat: Chat,
  followUpsList: Array<FollowUp>,
  user: User,
  getUserByID: (id: number) => User,
}

type DispatchProps = {
  loadChatDetail: (id: number) => void,
  loadFollowUps: (id: number, nextPageUrl?: string) => void,
  createFollowUp: (chatID: number, content: { content: string }) => void,
  updateFollowUp: (followup: FollowUp) => void,
  deleteFollowUp: (chatID: number, id: number) => void,
  deleteChat: (chatID: number) => void,
}

type ChatDetailPageProps = {
  match: { params: { id: number } }
} & DispatchProps & StateProps

const ChatDetailPage = ({
  id, chat, followUpsList, loadChatDetail, loadFollowUps, createFollowUp, updateFollowUp, user, getUserByID, deleteFollowUp, deleteChat,
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
      getUserByID={getUserByID}
      deleteFollowUp={deleteFollowUp}
      deleteChat={deleteChat}
    />
  )
}

const mapStateToProps = (state: RootState, ownProps: ChatDetailPageProps) => {
  const { id } = ownProps.match.params
  return {
    id,
    chat: selectors.chats.getChatByID(state, id),
    followUpsList: selectors.chats.getFollowupsForChatID(state, id),
    user: selectors.user.getUser(state),
    getUserByID: (id: string) => selectors.entities.getUserByID(state, id),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  loadChatDetail: (id: number) => dispatch(loadChatDetail(id)),
  loadFollowUps: (chatID: number, nextPageUrl?: string) => dispatch(loadFollowUps(chatID, nextPageUrl)),
  createFollowUp: (chatID: number, content: { content: string }) => dispatch(createFollowUp(chatID, content)),
  updateFollowUp: (followUp: FollowUp) => dispatch(updateFollowUp(followUp)),
  deleteFollowUp: (chatID: number, id: number) => dispatch(deleteFollowUpAC(chatID, id)),
  deleteChat: (chatID: number) => dispatch(deleteChatAC(chatID)), 
})
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatDetailPage))

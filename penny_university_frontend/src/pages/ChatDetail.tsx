import React, { useEffect } from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  createFollowUp, loadChatDetail, loadFollowUps, updateFollowUp,
} from '../actions/chat.ts'
import { ChatDetail } from '../components/chats/index.ts'
import * as selectors from '../selectors/index.ts'
import { RootState } from '../reducers/index.ts'
import { Chat, FollowUp, User } from '../models/index.ts'
import { FollowUpType } from '../models/followUp.ts';

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
  updateFollowUp: (followup: FollowUpType) => void,
}

type ChatDetailPageProps = {
  match: { params: { id: number } }
} & DispatchProps & StateProps

const ChatDetailPage = ({
  id, chat, followUpsList, loadChatDetail, loadFollowUps, createFollowUp, updateFollowUp, user, getUserByID,
}: ChatDetailPageProps) => {
  const userID = user?.id
  useEffect(() => {
    loadChatDetail(id)
    loadFollowUps(id)
  }, [id, loadChatDetail, loadFollowUps, userIDp])

  return (
    <ChatDetail
      chat={chat}
      followUps={followUpsList}
      createFollowUp={createFollowUp}
      updateFollowUp={updateFollowUp}
      user={user}
      getUserByID={getUserByID}
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
})
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatDetailPage))

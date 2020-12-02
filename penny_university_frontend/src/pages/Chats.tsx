import React, { useEffect } from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import ChatList from '../components/chats/ChatList'
import { loadChatsList } from '../actions/chat'
import ApiRoutes from '../constants'

type DispatchProps = {
  loadChatsList: (nextPageUrl?: string, filter?: string) => void,
}

type ChatsProps = DispatchProps & RouteComponentProps

const Chats = ({
  loadChatsList,
}: ChatsProps) => {
  useEffect(() => {
    loadChatsList(ApiRoutes.chats, 'all')
  }, [loadChatsList])
  return (
    <div>
      <ChatList filter={{ key: 'all', query: '' }} />
    </div>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => ({
  loadChatsList: (nextPageUrl: string, filter: string) => dispatch(loadChatsList(nextPageUrl, filter)),
})

// @ts-ignore
export default connect(null, mapDispatchToProps, null)(Chats)

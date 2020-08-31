import React from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
import { loadChatsList } from '../../actions/chat'
import { RootState } from '../../reducers'
import * as selectors from '../../selectors'
import ChatCard from './ChatCard'
import { Chat, User } from '../../models'

type StateProps = {
  nextPageUrl: string,
  chats: Array<number>,
  getChatByID: (id: number) => Chat,
  getUserByID: (id: number) => User,
  isFetching: boolean,
}

type DispatchProps = {
  loadChatsList: (nextPageUrl: string, key: string) => void,
}

type OwnProps = {
  filter: {key: string, query: string },
}

type ChatListProps = StateProps & DispatchProps & OwnProps & RouteComponentProps<{}>

const ChatList = ({
  chats, getChatByID, getUserByID, nextPageUrl, isFetching, loadChatsList, filter,
}: ChatListProps) => {
  const loadMore = () => {
    if (!isFetching) {
      loadChatsList(nextPageUrl, filter.key)
    }
  }
  return (
    <div>
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMore}
        hasMore={!!nextPageUrl && !isFetching}
        loader={<div className="loader" key={0}>Loading ...</div>}
        threshold={200}
      >
        {chats.map((chatID: number) => (
          <ChatCard chat={getChatByID(chatID)} key={`ChatCard-${chatID}`} getUserByID={getUserByID} />))}
      </InfiniteScroll>
    </div>
  )
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const chatsPagination = selectors.pagination.getChatsPagination(state, ownProps.filter.key)
  const { next: nextPageUrl } = chatsPagination
  return {
    chats: chatsPagination.ids,
    nextPageUrl,
    getChatByID: (id: number) => selectors.chats.getChatByID(state, id),
    getUserByID: (id: string) => selectors.entities.getUserByID(state, id),
    isFetching: selectors.pagination.isFetchingChats(state, ownProps.filter.key),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => ({
  loadChatsList: (nextPageUrl: string, key: string) => dispatch(loadChatsList(nextPageUrl, key)),
})

// @ts-ignore
const ConnectedChatList: React.ComponentClass<OwnProps> = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatList))
export default ConnectedChatList

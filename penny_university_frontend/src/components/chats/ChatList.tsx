import React from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroller"
import { loadChatsList } from '../../actions/chat'
import { RootState } from '../../reducers'
import * as selectors from '../../selectors'
import ChatCard from './ChatCard'
import { Chat } from '../../models'


type StateProps = {
  nextPageUrl: string,
  chats: Array<number>,
  getChatByID: (id: number) => Chat,
  isFetching: boolean,
}

type DispatchProps = {
  loadChatsList: (nextPageUrl?: string) => void,
}

type OwnProps = {
  filter: string,
}

type ChatListProps = StateProps & DispatchProps & OwnProps

const ChatList = ({ chats, getChatByID, nextPageUrl, isFetching, loadChatsList }: ChatListProps) => {
  const loadMore = (page: number) => {
    if (nextPageUrl.endsWith(page.toString()) && !isFetching) {
      const r = loadChatsList(nextPageUrl)
      console.log({nextPageUrl, page, r})
    }
  }
  return (
    <div>
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMore}
        hasMore={!!nextPageUrl && !isFetching}
        loader={<div className="loader" key={0}>Loading ...</div>}
      >
        {chats.map((chatID) => (
          <ChatCard chat={getChatByID(chatID)} key={`ChatCard-${chatID}`} />))}
      </InfiniteScroll>
    </div >
  )
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const chatsPagination = selectors.pagination.getChatsPagination(state, ownProps.filter)
  const { next: nextPageUrl } = chatsPagination
  return {
    chats: chatsPagination.ids,
    nextPageUrl,
    getChatByID: (id: number) => selectors.chats.getChatByID(state, id),
    isFetching: selectors.pagination.isFetchingChats(state),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  loadChatsList: (nextPageUrl: string) => dispatch(loadChatsList(nextPageUrl)),
})

// @ts-ignore
const ConnectedChatList: React.ComponentClass<OwnProps> = withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatList))
export default ConnectedChatList

import React, { useEffect } from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import InfiniteScroll from "react-infinite-scroller"
import { loadChatsList } from '../actions'
import { ChatCard } from '../components/chats'
import { RootState } from '../reducers'
import * as selectors from '../selectors'
import { Chat } from '../models'

type StateProps = {
  nextPageUrl: string,
  filteredChats: Array<number>,
  getChatByID: (id: number) => Chat,
  isFetching: boolean,
}

type DispatchProps = {
  loadChatsList: (nextPageUrl?: string) => void,
}

type ChatPageProps = StateProps & DispatchProps

const ChatsPage = ({ filteredChats, nextPageUrl, loadChatsList, getChatByID, isFetching }: ChatPageProps) => {
  useEffect(() => {
    loadChatsList()
  }, [loadChatsList])
  const loadMore = (page: number) => {
    if (nextPageUrl.endsWith(page.toString())) {
      loadChatsList(nextPageUrl)
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
        {filteredChats.map((chatID) => (
          <ChatCard chat={getChatByID(chatID)} key={`ChatCard-${chatID}`} />))}
      </InfiniteScroll>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const {
    pagination: { chatsByFilter },
    entities: { chats, users },
  } = state
  // @ts-ignore
  const chatsPagination = chatsByFilter.all || { ids: [] }
  const { next: nextPageUrl } = chatsPagination
  return {
    filteredChats: chatsPagination.ids,
    nextPageUrl,
    getChatByID: (id: number) => selectors.chats.getChatByID(state, id),
    isFetching: selectors.pagination.isFetchingChats(state),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  // @ts-ignore
  loadChatsList: (nextPageUrl: string) => dispatch(loadChatsList(nextPageUrl)),
})
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsPage))

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import { loadChatsList } from '../actions'
import { ChatList } from '../components/chats'
import { RootState } from '../reducers'
import * as selectors from '../selectors'
import { Chat } from '../models'

type StateProps = {
  nextPageUrl: string,
  filteredChats: Array<number>,
  getChatByID: (id: number) => Chat,
}

type DispatchProps = {
  loadChatsList: (filter: 'all', nextPageUrl?: string) => void,
}

type ChatPageProps = StateProps & DispatchProps

const ChatsPage = ({ filteredChats, nextPageUrl, loadChatsList, getChatByID }: ChatPageProps) => {
  useEffect(() => {
    loadChatsList('all')
  }, [loadChatsList])
  return (
    <div>
      <ChatList chats={filteredChats} getChatByID={getChatByID} />
      <Button className="mb-3" onClick={() => loadChatsList('all', nextPageUrl)}>Load More</Button>
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
  const { nextPageUrl } = chatsPagination
  return {
    filteredChats: chatsPagination.ids,
    nextPageUrl,
    getChatByID: (id: number) => selectors.chats.getChatByID(state, id),
  }
}

const mapDispatchToProps = {
  loadChatsList,
}
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsPage))

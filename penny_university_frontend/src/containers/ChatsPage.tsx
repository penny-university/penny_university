import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import { loadChatsList } from '../actions'
import { ChatList } from '../components/chats'
import { RootState } from '../reducers'

type StateProps = {
  nextPageUrl: string,
  filteredChats: Array<Chat>,
}

type DispatchProps = {
  loadChatsList: (filter: 'all', nextPageUrl?: string) => void,
}

type ChatPageProps = StateProps & DispatchProps

const ChatsPage = ({ filteredChats, nextPageUrl, loadChatsList }: ChatPageProps) => {
  useEffect(() => {
    loadChatsList('all')
  }, [loadChatsList])
  return (
    <div>
      <ChatList chats={filteredChats} />
      <Button className="mb-3" onClick={(e) => loadChatsList('all', nextPageUrl)}>Load More</Button>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const {
    pagination: { chatsByFilter },
    entities: { chats, userProfiles },
  } = state
  // @ts-ignore
  const chatsPagination = chatsByFilter.all || { ids: [] }
  const { nextPageUrl } = chatsPagination
  const filteredChats = chatsPagination.ids
    // @ts-ignore
    .map((id) => chats[id])
    // @ts-ignore
    .map((chat) => {
      const c = chat
      // if userProfile is just an ID, populate the full userProfile
      c.participants = c.participants
      .map((c: Participant) => ((typeof (c.userProfile) === 'number') ? { userProfile: userProfiles[c.userProfile], role: c.role } : c))
      .sort((a: UserProfile, b: UserProfile) => {
        if (a.role === 'Organizer') return -1
        if (b.role === 'Organizer') return -1
        return 0
      })
      return c
    })

  return {
    filteredChats,
    nextPageUrl,
  }
}

const mapDispatchToProps = {
  loadChatsList,
}
// @ts-ignore
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsPage))

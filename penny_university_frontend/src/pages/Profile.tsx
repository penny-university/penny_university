import React from 'react'
import { connect } from 'react-redux'
import { ChatList } from '../components'
import { User } from '../models'
import { RootState } from '../reducers'
import * as selectors from '../selectors'

type StateProps = {
  user: User,
}

type DispatchProps = {
}

type ChatPageProps = StateProps & DispatchProps

const ChatsPage = ({ user }: ChatPageProps) => {
  return (
    <div>
      <h1>My Chats</h1>
      <ChatList filter={user.id.toString()} />
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  user: selectors.user.getUser(state)
})

// @ts-ignore
export default connect(mapStateToProps)(ChatsPage)

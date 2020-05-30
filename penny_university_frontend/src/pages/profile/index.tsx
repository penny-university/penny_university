import React, { useEffect } from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { ChatList } from '../../components'
import { SettingsButton } from '../../components/buttons'
import modalDispatch from '../../components/modal/dispatch'
import { User } from '../../models'
import { RootState } from '../../reducers'
import * as selectors from '../../selectors'
import { loadChatsList } from '../../actions/chat'
import ApiRoutes from '../../constants'

type StateProps = {
  user: User,
  me: User,
}

type DispatchProps = {
  loadChatsList: (nextPageUrl?: string, userID?: string) => void,
}

type TParams = { id: string };

type ChatPageProps = StateProps & DispatchProps & RouteComponentProps<TParams>

const ChatsPage = ({ loadChatsList, match, me, user }: ChatPageProps) => {
  const { id } = match.params
  useEffect(() => {
    loadChatsList(ApiRoutes.userChats(id), id)
  }, [loadChatsList, id])
  const myProfile = user?.id === me?.id
  const possesive =  myProfile ? 'My ' : `${user?.displayName}'s`
  return (
    <div>
      <div className="d-flex flex-row-reverse">
        { myProfile ? <SettingsButton onClick={() => modalDispatch.settings(user)} /> : null}
      </div>
      <h1>{`${possesive} Chats`}</h1>
      <ChatList filter={{ key: id, query: `participants__user_id=${id}` }} />
    </div>
  )
}

const mapStateToProps = (state: RootState, ownProps: ChatPageProps) => ({
  me: selectors.user.getUser(state),
  user: selectors.entities.getUserByID(state, ownProps.match.params.id)
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  // @ts-ignore
  loadChatsList: (nextPageUrl: string, userID) => dispatch(loadChatsList(nextPageUrl, userID)),
})

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(ChatsPage)
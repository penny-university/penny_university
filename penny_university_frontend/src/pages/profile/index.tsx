import React, { useEffect, useCallback } from 'react'
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

type ProfilePageProps = StateProps & DispatchProps & RouteComponentProps<TParams>

const ProfilePage = ({
  loadChatsList, match, me, user,
}: ProfilePageProps) => {
  const { id } = match.params
  useEffect(() => {
    loadChatsList(ApiRoutes.userChats(id), id)
  }, [loadChatsList, id])
  const myProfile = user?.id === me?.id
  const possesive = myProfile ? 'My ' : `${user?.displayName}'s`
  const openSettingsModal = useCallback(
    () => {
      modalDispatch.settings(me)
    },
    [me],
  );
  return (
    <div>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h1>{`${possesive} Chats`}</h1>
        {myProfile ? <SettingsButton onClick={openSettingsModal} className="h-100" /> : null}
      </div>
      <ChatList filter={{ key: id, query: `participants__user_id=${id}` }} />
    </div>
  )
}

const mapStateToProps = (state: RootState, ownProps: ProfilePageProps) => ({
  me: selectors.user.getUser(state),
  user: selectors.entities.getUserByID(state, ownProps.match.params.id),
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  // @ts-ignore
  loadChatsList: (nextPageUrl: string, userID) => dispatch(loadChatsList(nextPageUrl, userID)),
})

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps, null)(ProfilePage)

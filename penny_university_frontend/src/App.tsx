import React, { useEffect } from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Container } from 'reactstrap'
import { Modal, Navigation, Alert } from './components/index.ts'

import ChatsPage from './pages/Chats.tsx'
import ChatDetailPage from './pages/ChatDetail.tsx'
import { ProfilePage } from './pages/index.ts'
import VerifyPage from './pages/Verify.tsx'
import { bootstrap, logout } from './actions/user.ts'
import * as selectors from './selectors/index.ts'
import { RootState } from './reducers/index.ts'
import { Routes } from './constants/index.ts'
import { User } from './models/index.ts'

type StateProps = {
  user: User,
}

type DispatchProps = {
  dispatchBootstrap: () => void,
  dispatchLogout: () => void,
}

type Props = StateProps & DispatchProps

const App = (props: Props) => {
  const { dispatchBootstrap, user, dispatchLogout } = props
  useEffect(() => {
    dispatchBootstrap()
  }, [dispatchBootstrap])
  return (
    <>
      <Navigation user={user} logout={dispatchLogout} />
      <Container className="mt-3">
        <Switch>
          <Route path={Routes.ChatDetail} component={ChatDetailPage} />
          <Route path={Routes.Chats} component={ChatsPage} />
          <Route path={Routes.VerifyEmail} component={VerifyPage} />
          <Route path={Routes.Profile} component={ProfilePage} />
          <Route path={Routes.Home}>
            <Redirect to={Routes.Chats} />
          </Route>
        </Switch>
        <Alert />
        <Modal />
      </Container>
    </>
  )
}

const mapStateToProps = (state: RootState): StateProps => ({
  user: selectors.user.getUser(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): DispatchProps => ({
  dispatchBootstrap: () => dispatch(bootstrap()),
  dispatchLogout: () => dispatch(logout()),
})


export default connect(mapStateToProps, mapDispatchToProps)(App)

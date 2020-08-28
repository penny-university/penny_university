import React, { useEffect } from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Container } from 'reactstrap'
import * as Sentry from '@sentry/browser';
import { Modal, Navigation, Alert } from './components'

import ChatsPage from './pages/Chats'
import ChatDetailPage from './pages/ChatDetail'
import { ProfilePage } from './pages'
import VerifyPage from './pages/Verify'
import { bootstrap, logout } from './actions/user'
import * as selectors from './selectors'
import { RootState } from './reducers'
import { Routes } from './constants'
import { User } from './models'
import PasswordResetPage from './pages/PasswordReset';
import config from './config'

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
  if (process.env.NODE_ENV !== 'development') {
    Sentry.init({ dsn: config.sentry })
  }
  return (
    <>
      <Navigation user={user} logout={dispatchLogout} />
      <Container className="mt-3">
        <Switch>
          <Route path={Routes.ChatDetail} component={ChatDetailPage} />
          <Route path={Routes.Chats} component={ChatsPage} />
          <Route path={Routes.VerifyEmail} component={VerifyPage} />
          <Route path={Routes.Profile} component={ProfilePage} />
          <Route path={Routes.ResetPassword} component={PasswordResetPage} />
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

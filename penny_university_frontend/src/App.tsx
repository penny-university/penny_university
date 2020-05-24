import React, { useEffect } from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Container } from 'reactstrap'
import { Modal } from './components'
import { Navigation, Alert, PrivateRoute } from './components'
import ChatsPage from './pages/Chats'
import ChatDetailPage from './pages/ChatDetail'
import ProfilePage from './pages/Profile'
import { bootstrap, logout } from './actions/user'
import * as selectors from './selectors'
import { RootState } from './reducers'
import { Routes } from './constants'
import { User } from './models'

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
          <Route path={Routes.ChatDetail}>
            <ChatDetailPage />
          </Route>
          <Route path={Routes.Chats}>
            <ChatsPage />
          </Route>
          <PrivateRoute path={Routes.Profile} component={ProfilePage} />
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

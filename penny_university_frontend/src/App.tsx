import React, { useEffect } from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Container } from 'reactstrap'
import { Modal } from './components'
import { Navigation } from './components/nav'
import AlertContainer from './containers/AlertContainer'
import ChatsPage from './containers/ChatsPage'
import ChatDetailPage from './containers/ChatDetailPage'
import { checkAuth, logout } from './actions/user'
import * as selectors from './selectors'
import { RootState } from './reducers'

type StateProps = {
  authed: boolean,
}

type DispatchProps = {
  dispatchCheckAuth: () => void,
  dispatchLogout: () => void,
}

type Props = StateProps & DispatchProps

const App = (props: Props) => {
  const { dispatchCheckAuth, authed, dispatchLogout } = props
  useEffect(() => {
    dispatchCheckAuth()
  })
  return (
    <>
      <Navigation authed={authed} logout={dispatchLogout} />
      <Container className="mt-3" fluid>
        <Switch>
          <Route path="/chats/:id">
            <ChatDetailPage />
          </Route>
          <Route path="/chats">
            <ChatsPage />
          </Route>
          <Route path="/">
            <Redirect to="/chats" />
          </Route>
        </Switch>
        <AlertContainer />
        <Modal />
      </Container>
    </>
  )
}

const mapStateToProps = (state: RootState): StateProps => ({
  authed: selectors.user.getAuthed(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): DispatchProps => ({
  dispatchCheckAuth: () => dispatch(checkAuth()),
  dispatchLogout: () => dispatch(logout()),
})


export default connect(mapStateToProps, mapDispatchToProps)(App)

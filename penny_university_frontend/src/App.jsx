import React, { useEffect } from 'react'
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'
import propTypes from 'prop-types'
import { Modal } from './components'
import { Navigation } from './components/nav'
import AlertContainer from './containers/AlertContainer'
import ChatsPage from './containers/ChatsPage'
import ChatDetailPage from './containers/ChatDetailPage'
import { checkAuth, logout } from './actions/user'
import * as selectors from './selectors'

const App = (props) => {
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

const mapStateToProps = (state) => ({
  authed: selectors.user.getAuthed(state),
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCheckAuth: () => dispatch(checkAuth()),
  dispatchLogout: () => dispatch(logout()),
})


App.propTypes = {
  dispatchCheckAuth: propTypes.func.isRequired,
  dispatchLogout: propTypes.func.isRequired,
  authed: propTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

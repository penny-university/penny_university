import React, { useEffect } from 'react'
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'
import { Navigation } from './components/nav'
import AlertContainer from './containers/AlertContainer'
import ChatsPage from './containers/ChatsPage'
import ChatDetailPage from './containers/ChatDetailPage'
import { checkAuth } from './actions/user'

const App = (props) => {
  const { checkAuth } = props
  useEffect(() => {
    checkAuth()
  })
  return (
    <>
      <Navigation />
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
      </Container>
    </>
  )
}

const mapStateToProps = () => {}

const mapDispatchToProps = (dispatch) => ({
  checkAuth: () => dispatch(checkAuth()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

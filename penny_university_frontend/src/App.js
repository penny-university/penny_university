import React from 'react'
import {Provider} from 'react-redux'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import {Navigation} from './components/nav'
import AlertContainer from './containers/AlertContainer'
import ChatsPage from './containers/ChatsPage'
import ChatDetailPage from './containers/ChatDetailPage'
import Container from "reactstrap/es/Container"

const App = ({store}) => (
  <Provider store={store}>
    <Navigation/>
    <Container className='mt-3' fluid>
      <Switch>
        <Route path='/chats/:id'>
          <ChatDetailPage/>
        </Route>
        <Route path='/chats'>
          <ChatsPage/>
        </Route>
        <Route path='/'>
          <Redirect to='/chats'/>
        </Route>
      </Switch>
      <AlertContainer/>
    </Container>
  </Provider>
)

export default App

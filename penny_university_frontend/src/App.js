import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import {Navigation} from './components/nav';
import {ChatDetail, ChatList} from './components/chats';
import Container from "reactstrap/es/Container";

function App() {
  return (
    <Router>
      <Navigation/>
      <div className='main'>
        <Container fluid>
          <Switch>
            <Route path='/chats/:id'>
              <ChatDetail/>
            </Route>
            <Route path='/chats'>
              <ChatList/>
            </Route>
            <Route path='/'>
              <Redirect to='/chats'/>
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;

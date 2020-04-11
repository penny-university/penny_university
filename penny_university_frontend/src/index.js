import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore, compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer, { initialState } from './reducers'
import api from './middleware/api'
import user from './middleware/user'
import './style.css'
import App from './App'

// Eventually we will want to move this into a DEV configuration
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, initialState, composeEnhancers(
  applyMiddleware(thunk, api, user)
))

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)

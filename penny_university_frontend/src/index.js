import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {applyMiddleware, createStore, compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import api from './middleware/api'
import './index.css'
import './style.css'
import App from './App'

// Eventually we will want to move this into a DEV configuration
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk, api)
))

ReactDOM.render(
  <Router>
    <App store={store}/>
  </Router>,
  document.getElementById('root')
)

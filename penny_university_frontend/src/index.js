import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import api from './middleware/api'
import './index.css'
import './style.css'
import App from './App'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, api)
)

ReactDOM.render(
  <Router>
    <App store={store}/>
  </Router>,
  document.getElementById('root')
)

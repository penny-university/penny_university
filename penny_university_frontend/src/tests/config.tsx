import React from 'react'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { compose } from 'redux'
import { Router } from 'react-router-dom'
import api from '../middleware/api'
import user from '../middleware/user'
import { initialState, RootState } from '../reducers'
import {
  allChatsNormalized, allChatIDs, allChats, allUsers, normalizedFollowUps,
} from './data'
import { User } from '../models'

export const baseUrl = 'http://localhost:8000/api/'
const history = createMemoryHistory()
// @ts-ignore
const mockStore = configureMockStore(compose([thunk, user, api]))

export const makeMockStore = (state = {}) => mockStore({
  ...initialState,
  ...state,
})

export const MockAppState = ({ store, children }:
  { store: RootState, children: React.Component }) => (
    <Provider store={makeMockStore(store)}>
      <Router history={history}>
        {children}
      </Router>
    </Provider>
)

const unauthenticatedState = {
  user: {
    token: 'token',
    // @ts-ignore
    user: new User(),
  },
  entities: {
    chats: allChatsNormalized,
    followUps: normalizedFollowUps,
    users: allUsers,
  },
  pagination: {
    chatsByFilter: {
      all: {
        isFetching: false,
        // @ts-ignore
        next: allChats.next,
        // @ts-ignore
        previous: allChats.previous,
        // @ts-ignore
        count: allChats.count,
        // @ts-ignore
        ids: allChatIDs,
      },
      1: {
        isFetching: false,
        // @ts-ignore
        next: allChats.next,
        // @ts-ignore
        previous: allChats.previous,
        // @ts-ignore
        count: allChats.count,
        ids: [1, 3],
      },
    },
    followUpsByChat: {},
  },
  error: { status: NaN, message: '' },
}

const authenticatedState = {
  ...unauthenticatedState, user: { token: null, user: new User(allUsers ? allUsers['1'] : undefined) },
}

export {
  initialState,
  authenticatedState,
  unauthenticatedState,
}

import thunk from 'redux-thunk'
import api from '../middleware/api'
import configureMockStore from 'redux-mock-store'

export const baseUrl = "http://localhost:8000/api/"

export const startState = {}
export const mockStore = configureMockStore([thunk, api])

export const makeMockStore = (state = {}) => {
  return mockStore({
    ...startState,
    ...state,
  })
}

export const initialState = {
  entities: {
    chats: {},
    followUps: {},
    users: {}
  },
  pagination: {
    chatsByFilter: {},
    followUpsByChat: {}
  }
}

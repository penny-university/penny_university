import thunk from 'redux-thunk'
import api from '../middleware/api'
import configureMockStore from 'redux-mock-store'

export const baseUrl = "http://localhost:8000/api/"

export const mockStore = configureMockStore([thunk, api])

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

export const makeMockStore = (state = {}) => {
  return mockStore({
    ...initialState,
    ...state,
  })
}

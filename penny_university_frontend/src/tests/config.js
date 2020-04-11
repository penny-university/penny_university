import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import api from '../middleware/api'
import user from '../middleware/user'
import { initialState } from '../reducers'

export const baseUrl = "http://localhost:8000/api/"


export const makeMockStore = (state = {}, middleware = [api]) => {
  const mockStore = configureMockStore([thunk, ...middleware])
  return mockStore({
    ...initialState,
    ...state,
  })
}

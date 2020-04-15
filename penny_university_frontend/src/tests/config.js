import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { compose } from 'redux'
import api from '../middleware/api'
import user from '../middleware/user'
import { initialState } from '../reducers'

export const baseUrl = 'http://localhost:8000/api/'

const mockStore = configureMockStore(compose([thunk, user, api]))

export const makeMockStore = (state = {}) => mockStore({
  ...initialState,
  ...state,
})

export {
  initialState,
}

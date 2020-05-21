import { AnyAction } from 'redux'
import * as ActionTypes from '../actions/user'
import { User } from '../models'

export const initialState: UserState = {
  token: null,
  user: null,
}

const user = (state = initialState, action: AnyAction): UserState => {
  const newState = { ...state }
  const { payload, type } = action
  switch (type) {
    case ActionTypes.SET_TOKEN:
      newState.token = payload
      break
    case ActionTypes.FETCH_USER_SUCCESS:
      newState.user = new User(action.payload.result)
      break
    case ActionTypes.LOGOUT_SUCCESS:
      newState.token = null
      newState.user = null
      break
    default:
  }
  return newState
}

export default user

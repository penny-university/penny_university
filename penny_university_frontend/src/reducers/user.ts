import * as ActionTypes from '../actions/user'
import { AnyAction } from 'redux'

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
      newState.user = action.payload.result
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

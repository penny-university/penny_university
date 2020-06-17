import { AnyAction } from 'redux'
import { Actions } from '../actions/user.ts'
import { User } from '../models/index.ts'

export const initialState: UserState = {
  token: null,
  user: null,
}

const user = (state = initialState, action: AnyAction): UserState => {
  const newState = { ...state }
  const { payload, type } = action
  switch (type) {
    case Actions.SET_TOKEN:
      newState.token = payload
      break
    case Actions.FETCH_USER_SUCCESS:
    case Actions.UPDATE_USER_SUCCESS:
      newState.user = new User(action.payload.result)
      break
    case Actions.LOGOUT_SUCCESS:
      newState.token = null
      newState.user = null
      break
    default:
  }
  return newState
}

export default user

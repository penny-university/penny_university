import * as ActionTypes from '../actions/user'

export const initialState = {
  token: null,
  user: null,
}

const user = (state = initialState, action) => {
  const newState = { ...state }
  const { payload, type } = action
  switch (type) {
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.SIGNUP_SUCCESS:
      newState.user = payload
      break
    case ActionTypes.SET_TOKEN:
      newState.token = payload
      break
    default:
  }
  return newState
}

export default user

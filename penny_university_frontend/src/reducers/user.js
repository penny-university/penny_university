import * as ActionTypes from '../actions/user'

export const initialState = {
  token: null,
  user: null,
}

const user = (state = initialState, action) => {
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

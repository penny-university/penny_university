import { combineReducers } from 'redux'
import deepmerge from 'deepmerge'
import * as ActionTypes from '../actions'
import paginate from './paginate'
import user, { initialState as userInitialState } from './user'

// Updates an entity cache in response to any action
// with response.entities, such as a CHATS_LIST_SUCCESS
const entities = (state = { chats: {}, followUps: {}, userProfiles: {} }, action) => {
  if (action.response && action.response.entities) {
    return deepmerge(state, action.response.entities)
  }

  return state
}

const errorReducer = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.CLEAR_ERROR_MESSAGE) {
    return null
  } if (error) {
    return error
  }

  return state
}

const pagination = combineReducers({
  chatsByFilter: paginate({
    mapActionToKey: () => 'all', // In the future, we will have different filters
    types: [
      ActionTypes.CHATS_LIST_REQUEST,
      ActionTypes.CHATS_LIST_SUCCESS,
      ActionTypes.CHATS_LIST_FAILURE,
    ],
  }),
  followUpsByChat: paginate({
    mapActionToKey: (action) => action.chatId,
    types: [
      ActionTypes.FOLLOW_UPS_REQUEST,
      ActionTypes.FOLLOW_UPS_SUCCESS,
      ActionTypes.FOLLOW_UPS_FAILURE,
    ],
  }),
})

export const initialState = {
  user: userInitialState,
  entities: {
    chats: {},
    followUps: {},
    users: {},
  },
  pagination: {
    chatsByFilter: {},
    followUpsByChat: {},
  },
}

const rootReducer = combineReducers({
  entities,
  error: errorReducer,
  pagination,
  user,
})

export default rootReducer

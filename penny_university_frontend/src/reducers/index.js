import { combineReducers } from 'redux'
import deepmerge from 'deepmerge'
import { normalize } from 'normalizr'
import * as ActionTypes from '../actions'
import paginate from './paginate'
import user, { initialState as userInitialState } from './user'

// Updates an entity cache in response to any action
// with response.entities, such as a CHATS_LIST_SUCCESS
const entities = (state = { chats: {}, followUps: {}, userProfiles: {} }, action) => {
  const { result, responseSchema } = action.payload || {}
  if (result) {
    const { entities = {} } = normalize(result, responseSchema)
    return deepmerge(state, entities)
  }

  return state
}

const errorReducer = (state = null, action) => {
  const { type, payload } = action
  if (type === ActionTypes.CLEAR_ERROR_MESSAGE) {
    return null
  } if (payload) {
    return payload
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
    mapActionToKey: (action) => action.payload?.meta?.chatId,
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

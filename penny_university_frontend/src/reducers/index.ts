import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import { AnyAction } from 'redux'
import { normalize } from 'normalizr'
import * as ActionTypes from '../actions'
import paginate from './paginate'
import user, { initialState as userInitialState } from './user'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import logging from '../middleware/logging'
import userMiddleware from '../middleware/user'
import { Schemas } from '../models/schemas'

// Eventually we will want to move this into a DEV configuration
const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Updates an entity cache in response to any action
// with response.entities, such as a CHATS_LIST_SUCCESS

const entities = (state: EntityState = { chats: {}, followUps: {}, users: {}, }, action: AnyAction): EntityState => {
  const { result, responseSchema } = action.payload || {}
  if (result && responseSchema) {
    const { entities: {chats = {}, users = {}, followUps = {}} = {} } = normalize(result, responseSchema)
    return {
      chats: {
        ...state.chats,
        ...chats,
      },
      users: {
        ...state.users,
        ...users,
      },
      followUps: {
        ...state.followUps,
        ...followUps,
      }
    }
  }

  return state
}

const errorReducer = (state = { status: NaN, message: '' }, action: AnyAction): ErrorState => {
  const { type, payload } = action
  if (type === ActionTypes.CLEAR_ERROR_MESSAGE) {
    return { status: NaN, message: '' }
  } if (payload) {
    return payload
  }
  return state
}

const pagination = combineReducers({
  chatsByFilter: paginate({
    mapActionToKey: (action?: AnyAction) => 'all', // In the future, we will have different filters
    types: [
      ActionTypes.CHATS_LIST_REQUEST,
      ActionTypes.CHATS_LIST_SUCCESS,
      ActionTypes.CHATS_LIST_FAILURE,
    ],
  }),
  followUpsByChat: paginate({
    mapActionToKey: (action?: AnyAction) => action?.payload?.meta?.chatID,
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
  error: { status: NaN, message: '' },
}

export const rootReducer = combineReducers({
  entities,
  error: errorReducer,
  pagination,
  user,
})


const store = createStore(rootReducer, initialState, composeEnhancers(
  applyMiddleware(thunk, api, userMiddleware, logging),
))

export type RootState = ReturnType<typeof rootReducer>

export { 
  Schemas
}

export default store

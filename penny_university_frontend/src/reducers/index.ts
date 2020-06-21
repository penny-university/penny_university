import {
  combineReducers, applyMiddleware, createStore, compose, AnyAction,
} from 'redux'

import { normalize } from 'normalizr'
import thunk from 'redux-thunk'
import { ChatActions, UserActions } from '../actions/index.ts'
import paginate, { paginationInitialState } from './paginate.ts'
import user, { initialState as userInitialState } from './user.ts'
import { Actions as UserAction } from '../actions/user.ts'
import api from '../middleware/api.ts'
import logging from '../middleware/logging.ts'
import userMiddleware from '../middleware/user.ts'
import { Schemas } from '../models/schemas.ts'

// Eventually we will want to move this into a DEV configuration
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Updates an entity cache in response to any action
// with response.entities, such as a CHATS_LIST_SUCCESS

const failureTypes = [
  ChatActions.CHATS_LIST_FAILURE,
  ChatActions.CHAT_DETAIL_FAILURE,
  ChatActions.FOLLOW_UPS_FAILURE,
  ChatActions.CREATE_FOLLOW_UP_FAILURE,
  ChatActions.UPDATE_FOLLOW_UP_FAILURE,
  UserActions.FETCH_USER_FAILURE,
  UserActions.LOGIN_FAILURE,
  UserActions.SIGNUP_FAILURE,
  UserActions.LOGOUT_FAILURE,
  UserActions.RESEND_VERIFY_EMAIL_FAILURE,
  UserActions.VERIFY_EMAIL_FAILURE,
]

const entities = (state: EntityState = { chats: {}, followUps: {}, users: {} }, action: AnyAction): EntityState => {
  const { result, responseSchema } = action.payload || {}
  if (result && responseSchema) {
    const { entities: { chats = {}, users = {}, followUps = {} } = {} } = normalize(result, responseSchema)
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
      },
    }
  }
  if (action.type === UserAction.UPDATE_USER_SUCCESS) {
    const newState = { ...state }
    newState.users[action.payload.result.id] = { ...newState.users[action.payload.result.id], ...action.payload.result }
    return newState
  }
  return state
}

const errorReducer = (state = { status: NaN, message: '' }, action: AnyAction): ErrorState => {
  const { type, payload } = action
  if (type === ChatActions.CLEAR_ERROR_MESSAGE) {
    return { status: NaN, message: '' }
  } if (failureTypes.includes(action.type)) {
    return payload
  }
  return state
}

const pagination = combineReducers({
  chatsByFilter: paginate({
    mapActionToKey: (action?: AnyAction) => action?.payload?.meta?.userID || 'all',
    types: [
      [ChatActions.CHATS_LIST_REQUEST],
      [ChatActions.CHATS_LIST_SUCCESS],
      [ChatActions.CHATS_LIST_FAILURE],
    ],
  }),
  followUpsByChat: paginate({
    mapActionToKey: (action?: AnyAction) => action?.payload?.meta?.chatID,
    types: [
      [ChatActions.FOLLOW_UPS_REQUEST],
      [ChatActions.FOLLOW_UPS_SUCCESS, ChatActions.CREATE_FOLLOW_UP_SUCCESS],
      [ChatActions.FOLLOW_UPS_FAILURE],
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
  pagination: paginationInitialState,
  error: { status: NaN, message: '' },
}

export const rootReducer = combineReducers({
  entities,
  error: errorReducer,
  pagination,
  user,
})

// @ts-ignore
const store = createStore(rootReducer, initialState, composeEnhancers(
  applyMiddleware(thunk, api, userMiddleware, logging),
))

export type RootState = ReturnType<typeof rootReducer>

export {
  Schemas,
}

export default store

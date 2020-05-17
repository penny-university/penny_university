import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { CALL_API } from '../middleware/api'
import { RootState } from '../reducers'
import { Schemas } from '../models/schemas'
import ApiRoutes  from '../constants'

export const CHATS_LIST_REQUEST = 'CHATS_LIST_REQUEST'
export const CHATS_LIST_SUCCESS = 'CHATS_LIST_SUCCESS'
export const CHATS_LIST_FAILURE = 'CHATS_LIST_FAILURE'

export const CHAT_DETAIL_REQUEST = 'CHAT_DETAIL_REQUEST'
export const CHAT_DETAIL_SUCCESS = 'CHAT_DETAIL_SUCCESS'
export const CHAT_DETAIL_FAILURE = 'CHAT_DETAIL_FAILURE'

export const FOLLOW_UPS_REQUEST = 'FOLLOW_UPS_REQUEST'
export const FOLLOW_UPS_SUCCESS = 'FOLLOW_UPS_SUCCESS'
export const FOLLOW_UPS_FAILURE = 'FOLLOW_UPS_FAILURE'

export const CREATE_FOLLOW_UP_REQUEST = 'CREATE_FOLLOW_UP_REQUEST'
export const CREATE_FOLLOW_UP_SUCCESS = 'CREATE_FOLLOW_UP_SUCCESS'
export const CREATE_FOLLOW_UP_FAILURE = 'CREATE_FOLLOW_UP_FAILURE'

export const UPDATE_FOLLOW_UP_REQUEST = 'UPDATE_FOLLOW_UP_REQUEST'
export const UPDATE_FOLLOW_UP_SUCCESS = 'UPDATE_FOLLOW_UP_SUCCESS'
export const UPDATE_FOLLOW_UP_FAILURE = 'UPDATE_FOLLOW_UP_FAILURE'

export const DELETE_FOLLOW_UP_REQUEST = 'DELETE_FOLLOW_UP_FAILURE'
export const DELETE_FOLLOW_UP_SUCCESS = 'DELETE_FOLLOW_UP_SUCCESS'
export const DELETE_FOLLOW_UP_FAILURE = 'DELETE_FOLLOW_UP_REQUEST'

export const DELETE_CHAT_REQUEST = 'DELETE_CHAT_FAILURE'
export const DELETE_CHAT_SUCCESS = 'DELETE_CHAT_SUCCESS'
export const DELETE_CHAT_FAILURE = 'DELETE_CHAT_REQUEST'

export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE'

// Creates an action that will fetch the chats list
export const loadChatsList = (nextPageUrl: string = ApiRoutes.chats) => ({
  type: CALL_API,
  payload: {
    types: [CHATS_LIST_REQUEST, CHATS_LIST_SUCCESS, CHATS_LIST_FAILURE],
    endpoint: nextPageUrl,
    schema: Schemas.CHAT_ARRAY,
  },
})

// Creates an action that will fetch a chat
export const loadChatDetail = (chatID: number) => ({
  type: CALL_API,
  payload: {
    types: [CHAT_DETAIL_REQUEST, CHAT_DETAIL_SUCCESS, CHAT_DETAIL_FAILURE],
    endpoint: ApiRoutes.chatDetail(chatID),
    schema: Schemas.CHAT,
  },
})

// Creates an action that will fetch the follow ups associated with a chat
export const loadFollowUps = (chatID: number, nextPageUrl: string | undefined) => ({
  type: CALL_API,
  payload: {
    meta: { chatID },
    types: [FOLLOW_UPS_REQUEST, FOLLOW_UPS_SUCCESS, FOLLOW_UPS_FAILURE],
    endpoint: nextPageUrl || `chats/${chatID}/follow-ups/`,
    schema: Schemas.FOLLOW_UP_ARRAY,
  },
})

export const updateFollowUp = (followUp: FollowUp) => ({
  type: CALL_API,
  payload: {
    types: [UPDATE_FOLLOW_UP_REQUEST, UPDATE_FOLLOW_UP_SUCCESS, UPDATE_FOLLOW_UP_FAILURE],
    endpoint: `follow-ups/${followUp.id}/`,
    schema: Schemas.FOLLOW_UP,
    method: 'PUT',
    payload: followUp,
  },
})

export const createFollowUp = (chatID: number, followUp: { content: string }) => ({
  type: CALL_API,
  payload: {
    types: [CREATE_FOLLOW_UP_REQUEST, CREATE_FOLLOW_UP_SUCCESS, CREATE_FOLLOW_UP_FAILURE],
    endpoint: `chats/${chatID}/follow-ups/`,
    schema: Schemas.FOLLOW_UP,
    method: 'POST',
    payload: followUp,
    meta: { chatID },
  },
})

export const deleteFollowUp = (chatID: number, followID: number) => ({
  type: CALL_API,
  payload: {
    types: [DELETE_FOLLOW_UP_REQUEST, DELETE_FOLLOW_UP_SUCCESS, DELETE_FOLLOW_UP_FAILURE],
    endpoint: `follow-ups/${followID}/`,
    method: 'DELETE',
    meta: { chatID, followID },
  },
})


export const deleteChat = (chatID: number,) => ({
  type: CALL_API,
  payload: {
    types: [DELETE_CHAT_REQUEST, DELETE_CHAT_SUCCESS, DELETE_CHAT_FAILURE],
    endpoint: ApiRoutes.chatDetail(chatID),
    method: 'DELETE',
    meta: { chatID },
  },
})

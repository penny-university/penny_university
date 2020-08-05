import { AnyAction } from 'redux';
import { CALL_API } from '../middleware/api'
import { Schemas } from '../models/schemas'
import ApiRoutes from '../constants'
import { FollowUpType } from '../models/followUp';

export const Actions = {
  CHATS_LIST_REQUEST: 'CHATS_LIST_REQUEST',
  CHATS_LIST_SUCCESS: 'CHATS_LIST_SUCCESS',
  CHATS_LIST_FAILURE: 'CHATS_LIST_FAILURE',
  CHAT_DETAIL_REQUEST: 'CHAT_DETAIL_REQUEST',
  CHAT_DETAIL_SUCCESS: 'CHAT_DETAIL_SUCCESS',
  CHAT_DETAIL_FAILURE: 'CHAT_DETAIL_FAILURE',
  FOLLOW_UPS_REQUEST: 'FOLLOW_UPS_REQUEST',
  FOLLOW_UPS_SUCCESS: 'FOLLOW_UPS_SUCCESS',
  FOLLOW_UPS_FAILURE: 'FOLLOW_UPS_FAILURE',
  CREATE_FOLLOW_UP_REQUEST: 'CREATE_FOLLOW_UP_REQUEST',
  CREATE_FOLLOW_UP_SUCCESS: 'CREATE_FOLLOW_UP_SUCCESS',
  CREATE_FOLLOW_UP_FAILURE: 'CREATE_FOLLOW_UP_FAILURE',
  UPDATE_FOLLOW_UP_REQUEST: 'UPDATE_FOLLOW_UP_REQUEST',
  UPDATE_FOLLOW_UP_SUCCESS: 'UPDATE_FOLLOW_UP_SUCCESS',
  UPDATE_FOLLOW_UP_FAILURE: 'UPDATE_FOLLOW_UP_FAILURE',
  DELETE_FOLLOW_UP_REQUEST: 'DELETE_FOLLOW_UP_REQUEST',
  DELETE_FOLLOW_UP_SUCCESS: 'DELETE_FOLLOW_UP_SUCCESS',
  DELETE_FOLLOW_UP_FAILURE: 'DELETE_FOLLOW_UP_FAILURE',
  CLEAR_ERROR_MESSAGE: 'CLEAR_ERROR_MESSAGE',
}

// Creates an action that will fetch the chats list
export const loadChatsList = (nextPageUrl: string, userID?: string): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.CHATS_LIST_REQUEST, Actions.CHATS_LIST_SUCCESS, Actions.CHATS_LIST_FAILURE],
    endpoint: nextPageUrl,
    schema: Schemas.CHAT_ARRAY,
    meta: { userID },
  },
})

// Creates an action that will fetch a chat
export const loadChatDetail = (chatID: number): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.CHAT_DETAIL_REQUEST, Actions.CHAT_DETAIL_SUCCESS, Actions.CHAT_DETAIL_FAILURE],
    endpoint: ApiRoutes.chatDetail(chatID),
    schema: Schemas.CHAT,
  },
})

// Creates an action that will fetch the follow ups associated with a chat
export const loadFollowUps = (chatID: number, nextPageUrl: string | undefined): AnyAction => ({
  type: CALL_API,
  payload: {
    meta: { chatID },
    types: [Actions.FOLLOW_UPS_REQUEST, Actions.FOLLOW_UPS_SUCCESS, Actions.FOLLOW_UPS_FAILURE],
    endpoint: nextPageUrl || `chats/${chatID}/follow-ups/`,
    schema: Schemas.FOLLOW_UP_ARRAY,
  },
})

export const updateFollowUp = (followUp: FollowUpType): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.UPDATE_FOLLOW_UP_REQUEST, Actions.UPDATE_FOLLOW_UP_SUCCESS, Actions.UPDATE_FOLLOW_UP_FAILURE],
    endpoint: `follow-ups/${followUp.id}/`,
    schema: Schemas.FOLLOW_UP,
    method: 'PUT',
    payload: followUp,
  },
})

export const createFollowUp = (chatID: number, followUp: { content: string }): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.CREATE_FOLLOW_UP_REQUEST, Actions.CREATE_FOLLOW_UP_SUCCESS, Actions.CREATE_FOLLOW_UP_FAILURE],
    endpoint: `chats/${chatID}/follow-ups/`,
    schema: Schemas.FOLLOW_UP,
    method: 'POST',
    payload: followUp,
    meta: { chatID },
  },
})

export const deleteFollowUp = (followUpID: number): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.DELETE_FOLLOW_UP_REQUEST, Actions.DELETE_FOLLOW_UP_SUCCESS, Actions.DELETE_FOLLOW_UP_FAILURE],
    endpoint: `follow-ups/${followUpID}/`,
    schema: Schemas.FOLLOW_UP,
    method: 'DELETE',
    meta: { followUpID },
  }
})

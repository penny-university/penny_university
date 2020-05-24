import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { CALL_API } from '../middleware/api'
import { RootState } from '../reducers'
import { Schemas } from '../models/schemas'

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
  CLEAR_ERROR_MESSAGE: 'CLEAR_ERROR_MESSAGE',
}

// Creates an action that will fetch the chats list
export const loadChatsList = (nextPageUrl: string, userID?: string) => ({
  type: CALL_API,
  payload: {
    types: [Actions.CHATS_LIST_REQUEST, Actions.CHATS_LIST_SUCCESS, Actions.CHATS_LIST_FAILURE],
    endpoint: nextPageUrl,
    schema: Schemas.CHAT_ARRAY,
    meta: { userID },
  },
})

// Creates an action that will fetch a chat
const fetchChat = (url: string) => ({
  type: CALL_API,
  payload: {
    types: [Actions.CHAT_DETAIL_REQUEST, Actions.CHAT_DETAIL_SUCCESS, Actions.CHAT_DETAIL_FAILURE],
    endpoint: url,
    schema: Schemas.CHAT,
  },
})

// Creates an action that will fetch the follow ups associated with a chat
const fetchFollowUps = (chatID: number, nextPageUrl: string) => ({
  type: CALL_API,
  payload: {
    meta: { chatID },
    types: [Actions.FOLLOW_UPS_REQUEST, Actions.FOLLOW_UPS_SUCCESS, Actions.FOLLOW_UPS_FAILURE],
    endpoint: nextPageUrl,
    schema: Schemas.FOLLOW_UP_ARRAY,
  },
})

const putFollowUp = (url: string, followUp: FollowUp) => ({
  type: CALL_API,
  payload: {
    types: [Actions.UPDATE_FOLLOW_UP_REQUEST, Actions.UPDATE_FOLLOW_UP_SUCCESS, Actions.UPDATE_FOLLOW_UP_FAILURE],
    endpoint: url,
    schema: Schemas.FOLLOW_UP,
    method: 'PUT',
    payload: followUp,
  },
})

const postFollowUp = (url: string, followUp: string) => ({
  type: CALL_API,
  payload: {
    types: [Actions.CREATE_FOLLOW_UP_REQUEST, Actions.CREATE_FOLLOW_UP_SUCCESS, Actions.CREATE_FOLLOW_UP_FAILURE],
    endpoint: url,
    schema: Schemas.FOLLOW_UP,
    method: 'POST',
    payload: followUp,
  },
})

export const loadChatDetail = (chatID: number) => (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => RootState) => {
  const chat = getState().entities.chats[chatID]

  if (chat) {
    return null
  }

  return dispatch(fetchChat(`chats/${chatID}/`))
}

export const loadFollowUps = (chatID: number, nextPage: string) => (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => RootState) => {
  const {
    next,
    count,
    // @ts-ignore
  } = getState().pagination.followUpsByChat[chatID] || {next: undefined, count: 0}
  if (count > 0 && !next) {
    return null
  }
  return dispatch(fetchFollowUps(chatID, next || `chats/${chatID}/follow-ups/`))
}

export const updateFollowUp = (followUp: FollowUp) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const url = `follow-ups/${followUp.id}/`
  return dispatch(putFollowUp(url, followUp))
}

export const createFollowUp = (chatID: number, followUp: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const url = `chats/${chatID}/follow-ups/`
  await dispatch(postFollowUp(url, followUp))

  return dispatch(fetchFollowUps(chatID, `${url}?page=last`))
}

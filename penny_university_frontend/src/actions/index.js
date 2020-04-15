import { CALL_API, Schemas } from '../middleware/api'

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

export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE'

// Creates an action that will fetch the chats list
const fetchChats = (nextPageUrl) => ({
  [CALL_API]: {
    types: [CHATS_LIST_REQUEST, CHATS_LIST_SUCCESS, CHATS_LIST_FAILURE],
    endpoint: nextPageUrl,
    schema: Schemas.CHAT_ARRAY,
  },
})

// Creates an action that will fetch a chat
const fetchChat = (url) => ({
  [CALL_API]: {
    types: [CHAT_DETAIL_REQUEST, CHAT_DETAIL_SUCCESS, CHAT_DETAIL_FAILURE],
    endpoint: url,
    schema: Schemas.CHAT,
  },
})

// Creates an action that will fetch the follow ups associated with a chat
const fetchFollowUps = (chatId, nextPageUrl) => ({
  chatId,
  [CALL_API]: {
    types: [FOLLOW_UPS_REQUEST, FOLLOW_UPS_SUCCESS, FOLLOW_UPS_FAILURE],
    endpoint: nextPageUrl,
    schema: Schemas.FOLLOW_UP_ARRAY,
  },
})

const putFollowUp = (url, followUp) => ({
  [CALL_API]: {
    types: [UPDATE_FOLLOW_UP_REQUEST, UPDATE_FOLLOW_UP_SUCCESS, UPDATE_FOLLOW_UP_FAILURE],
    endpoint: url,
    schema: Schemas.FOLLOW_UP,
    method: 'PUT',
    payload: followUp,
  },
})

const postFollowUp = (url, followUp) => ({
  [CALL_API]: {
    types: [CREATE_FOLLOW_UP_REQUEST, CREATE_FOLLOW_UP_SUCCESS, CREATE_FOLLOW_UP_FAILURE],
    endpoint: url,
    schema: Schemas.FOLLOW_UP,
    method: 'POST',
    payload: followUp,
  },
})

// These are all thunks. They return a call to dispatch with an action passed into it
export const loadChatsList = (filter, nextPage) => (dispatch, getState) => {
  const {
    nextPageUrl = 'chats/',
    pageCount = 0,
  } = getState().pagination.chatsByFilter[filter] || {}

  if (pageCount > 0 && !nextPage) {
    return null
  }

  return dispatch(fetchChats(nextPageUrl))
}

export const loadChatDetail = (chatId) => (dispatch, getState) => {
  const chat = getState().entities.chats[chatId]

  if (chat) {
    return null
  }

  return dispatch(fetchChat(`chats/${chatId}/`))
}

export const loadFollowUps = (chatId, nextPage) => (dispatch, getState) => {
  const {
    nextPageUrl = `chats/${chatId}/follow-ups/`,
    pageCount = 0,
  } = getState().pagination.followUpsByChat[chatId] || {}

  if (pageCount > 0 && !nextPage) {
    return null
  }

  return dispatch(fetchFollowUps(chatId, nextPageUrl))
}

export const updateFollowUp = (followUp) => (dispatch) => {
  const url = `follow-ups/${followUp.id}/`
  return dispatch(putFollowUp(url, followUp))
}

export const createFollowUp = (chatId, followUp) => async (dispatch) => {
  const url = `chats/${chatId}/follow-ups/`
  await dispatch(postFollowUp(url, followUp))

  return dispatch(fetchFollowUps(chatId, `${url}?page=last`))
}

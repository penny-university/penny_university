import { CALL_API, Schemas } from '../middleware/api'

export const CHATS_REQUEST = 'CHATS_REQUEST'
export const CHATS_SUCCESS = 'CHATS_SUCCESS'
export const CHATS_FAILURE = 'CHATS_FAILURE'

const fetchChats = (nextPageUrl) => ({
  [CALL_API]: {
    types: [ CHATS_REQUEST, CHATS_SUCCESS, CHATS_FAILURE ],
    endpoint: nextPageUrl,
    schema: Schemas.CHAT_ARRAY
  }
})

// This is a thunk! Returns a call to dispatch
export const loadChats = (filter, nextPage) => (dispatch, getState) => {
  const {
    nextPageUrl = 'chats/',
    pageCount = 0
  } = getState().pagination.chatsByFilter[filter] || {}

  if (pageCount > 0 && !nextPage) {
    return null
  }

  return dispatch(fetchChats(nextPageUrl))
}
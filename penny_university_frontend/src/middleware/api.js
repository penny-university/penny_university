import {normalize, schema} from 'normalizr'
import {camelizeKeys} from 'humps'
import fetch from 'cross-fetch'

const API_ROOT = 'http://localhost:8000/api/'

// Used to call the API so that all
const callApi = (endpoint, schema) => {
  const url = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(url)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        const camelJson = camelizeKeys(json.results)

        return Object.assign({}, normalize(camelJson, schema), {nextPageUrl: json.next})
      })
    )
}

const chatSchema = new schema.Entity('chats', {}, {
  idAttribute: chat => chat.url
})

const userSchema = new schema.Entity('users', {}, {
  idAttribute: user => user.id
})

const followUpSchema = new schema.Entity('followUps', {
  pennyChat: chatSchema,
  user: userSchema
}, {
  idAttribute: followUp => followUp.id
})

// Schemas for the responses from the API
export const Schemas = {
  CHAT: chatSchema,
  CHAT_ARRAY: [chatSchema],
  USER: userSchema,
  USER_ARRAY: [userSchema],
  FOLLOW_UP: followUpSchema,
  FOLLOW_UP_ARRAY: [followUpSchema]
}

export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let {endpoint} = callAPI
  const {schema, types} = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types
  next(actionWith({type: requestType}))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'An error occurred.'
    }))
  )
}
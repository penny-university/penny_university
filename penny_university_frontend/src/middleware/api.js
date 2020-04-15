import {normalize, schema} from 'normalizr'
import {camelizeKeys, decamelizeKeys} from 'humps'

const API_ROOT = 'http://localhost:8000/api/'

// Makes an API call, and properly formats the response.
const callApi = (endpoint, schema, method, payload) => {
  const url = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  switch (method) {
    case 'POST':
    case 'PUT':
      const jsonPayload = JSON.stringify(decamelizeKeys(payload))
      return fetch(url, {method, body: jsonPayload, headers: {'Content-Type': 'application/json'}})
        .then(response =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }

            const camelJson = json.results ? camelizeKeys(json.results) : camelizeKeys(json)

            // normalize the response into our defined schemas
            return Object.assign({}, normalize(camelJson, schema), {nextPageUrl: json.next})
          })
        )
    default:
      return fetch(url)
        .then(response =>
          response.json().then(json => {
            if (!response.ok) {
              return Promise.reject(json)
            }

            const camelJson = json.results ? camelizeKeys(json.results) : camelizeKeys(json)

            // normalize the response into our defined schemas
            return Object.assign({}, normalize(camelJson, schema), {nextPageUrl: json.next})
          })
        )
  }
}

const userProfileSchema = new schema.Entity('userProfiles', {}, {
  idAttribute: userProfile => userProfile.id
})

const chatSchema = new schema.Entity('chats', {
  participants: [{
    userProfile: userProfileSchema
  }]
}, {
  idAttribute: chat => chat.id
})

const followUpSchema = new schema.Entity('followUps', {
  pennyChat: chatSchema,
  userProfile: userProfileSchema
}, {
  idAttribute: followUp => followUp.id
})

// Schemas for the responses from the API
export const Schemas = {
  CHAT: chatSchema,
  CHAT_ARRAY: [chatSchema],
  USER: userProfileSchema,
  USER_ARRAY: [userProfileSchema],
  FOLLOW_UP: followUpSchema,
  FOLLOW_UP_ARRAY: [followUpSchema]
}

export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callApiAction = action[CALL_API]
  if (typeof callApiAction === 'undefined') {
    return next(action)
  }

  let {endpoint} = callApiAction
  const {schema, types, method, payload} = callApiAction

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  // We will always pass a request, success, and failure action type
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

  return callApi(endpoint, schema, method, payload).then(
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

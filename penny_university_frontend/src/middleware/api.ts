import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux"
import { Schema } from 'normalizr'
import { camelizeKeys, decamelizeKeys } from 'humps'
import * as selectors from '../selectors'
import ApiRoutes from '../constants'
const API_ROOT = 'http://localhost:8000/api/'


export type APIPayload<P> = {
  types: [string, string, string],
  endpoint: valueof<typeof ApiRoutes>,
  method: 'POST' | 'PUT' | 'GET' | 'DELETE',
  payload: P,
}

// Makes an API call, and properly formats the response.
const callApi = (endpoint: string, method: 'POST' | 'PUT' | 'GET' | 'DELETE', payload: any, token?: string | null) => {
  const url = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  const jsonPayload = JSON.stringify(decamelizeKeys(payload))
  const headers: { [header: string]: string } = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Token ${token}`
  }
  switch (method) {
    case 'POST':
    case 'PUT':
      return fetch(url, { method, body: jsonPayload, headers })
        .then((response: Response) => response.json().then((json) => {
          if (!response.ok) {
            return Promise.reject(response)
          }
          const camelJson = json.results ? camelizeKeys(json.results) : camelizeKeys(json)
          return camelJson
        }))
    default:
      return fetch(url, { headers })
        .then((response: Response) => response.json().then((json) => {
          if (!response.ok) {
            return Promise.reject(response)
          }

          const camelJson = json.results ? camelizeKeys(json.results) : camelizeKeys(json)
          return camelJson
        }))
  }
}

export const CALL_API = 'CALL_API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
const api: Middleware<Dispatch> = (store: MiddlewareAPI) => (next: (action: AnyAction) => void) => (action: AnyAction) => {
  if (action.type === CALL_API) {
    let { endpoint } = action.payload
    const {
      schema: responseSchema, types, method, payload, meta,
    } = action.payload
    if (typeof endpoint === 'function') {
      endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
      throw new Error('Specify a string endpoint URL.')
    }
    // We will always pass a request, success, and failure action type
    if (!Array.isArray(types) || types.length !== 3) {
      throw new Error('Expected an array of three action types.')
    }
    if (!types.every((type) => typeof type === 'string')) {
      throw new Error('Expected action types to be strings.')
    }

    const [requestType, successType, failureType] = types
    next({ type: requestType, payload: { meta } })
    const token = selectors.user.getToken(store.getState())
    return callApi(endpoint, method, payload, token).then(
      (response: any) => next({
        payload: { result: response, responseSchema, meta },
        type: successType,
      }),
      (error: { message: string, status: number }) => next({
        type: failureType,
        payload: { message: error.message || 'An error occurred.', status: error.status, meta },
      }),
      )
    }
    return next(action)
}

export default api

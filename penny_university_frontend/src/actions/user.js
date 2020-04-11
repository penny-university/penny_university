import {CALL_API, Schemas} from '../middleware/api'

export const HYDRATE_USER = 'HYDRATE_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const CHECK_AUTH = 'CHECK_AUTH'
export const SET_TOKEN = 'SET_TOKEN'
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'


export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
})

export const checkAuth = () => ({
  type: CHECK_AUTH,
})

export const fetchUser = () => ({
    [CALL_API]: {
      types: [FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE],
      endpoint: 'me',
      schema: Schemas.USER
    },
})

const login = () => ({
  [CALL_API]: {
    types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
    endpoint: 'login',
    schema: Schemas.USER
  }
})

const signup = () => ({
  [CALL_API]: {
    types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
    endpoint: 'signup',
    schema: Schemas.USER
  }
})

const logout = () => ({
  type: LOGOUT_USER
})

export const dispatchSetToken = (token) => async (dispatch) => {
  return dispatch(setToken(token))
}

export const dispatchCheckAuth = () => async (dispatch) => {
  return dispatch(checkAuth())
}

export const dispatchFetchUser = () => async (dispatch) => {
  return dispatch(fetchUser())
}

export const dispatchSignup = () => async (dispatch) => {
  return dispatch(signup())
}

export const dispatchLogin = () => async (dispatch) => {
  return dispatch(login())
}

export const dispatchLogout = () => async (dispatch) => {
  return dispatch(logout())
}

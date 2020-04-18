import { CALL_API } from '../middleware/api'
import ApiRoutes from '../constants'

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
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'
export const USER_EXISTS_REQUEST = 'USER_EXISTS_REQUEST'
export const USER_EXISTS_SUCCESS = 'USER_EXISTS_SUCCESS'
export const USER_EXISTS_FAILURE = 'USER_EXISTS_FAILURE'


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
    endpoint: ApiRoutes.user,
    method: 'GET',
  },
})

const login = (payload) => ({
  [CALL_API]: {
    types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
    endpoint: ApiRoutes.login,
    method: 'POST',
    payload,
  },
})

const signup = (payload) => ({
  [CALL_API]: {
    types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
    endpoint: ApiRoutes.register,
    method: 'POST',
    payload,
  },
})


const userExists = (email) => ({
  [CALL_API]: {
    types: [USER_EXISTS_REQUEST, USER_EXISTS_SUCCESS, USER_EXISTS_FAILURE],
    endpoint: ApiRoutes.exists,
    method: 'POST',
    payload: { email },
  },
})

export const logout = () => ({
  type: LOGOUT_USER,
})
export const logoutRequest = () => ({
  [CALL_API]: {
    types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
    endpoint: ApiRoutes.logout,
    method: 'POST',
  },
})

export const dispatchFetchUser = () => async (dispatch) => dispatch(fetchUser())

export const dispatchSignup = (payload) => async (dispatch) => dispatch(signup(payload))

export const dispatchLogin = (payload) => async (dispatch) => dispatch(login(payload))

export const dispatchLogout = () => async (dispatch) => dispatch(logout())

export const dispatchUserExists = (email) => async (dispatch) => dispatch(userExists(email))

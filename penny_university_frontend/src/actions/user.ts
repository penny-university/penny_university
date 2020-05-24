import { CALL_API, APIPayload } from '../middleware/api'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import ApiRoutes from '../constants'

export const Actions = {
  HYDRATE_USER: 'HYDRATE_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  BOOTSTRAP: 'BOOTSTRAP',
  SET_TOKEN: 'SET_TOKEN',
  FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  USER_EXISTS_REQUEST: 'USER_EXISTS_REQUEST',
  USER_EXISTS_SUCCESS: 'USER_EXISTS_SUCCESS',
  USER_EXISTS_FAILURE: 'USER_EXISTS_FAILURE',
}


export const setToken = (token: string) => ({
  type: Actions.SET_TOKEN,
  payload: token,
})

export const bootstrap = () => ({
  type: Actions.BOOTSTRAP,
})

export const fetchUser = () => ({
  type: CALL_API,
  payload: {
    types: [Actions.FETCH_USER_REQUEST, Actions.FETCH_USER_SUCCESS, Actions.FETCH_USER_FAILURE],
    endpoint: ApiRoutes.user,
    method: 'GET',
  },
})

const login = (payload: { email: string, password: string }): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.LOGIN_REQUEST, Actions.LOGIN_SUCCESS, Actions.LOGIN_FAILURE],
    endpoint: ApiRoutes.login,
    method: 'POST',
    payload,
  },
})

export const signup = (payload: { email: string, password: string }): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.SIGNUP_REQUEST, Actions.SIGNUP_SUCCESS, Actions.SIGNUP_FAILURE],
    endpoint: ApiRoutes.register,
    method: 'POST',
    payload,
  },
})


const userExists = (email: string) => ({
  type: CALL_API,
  payload: {
    types: [Actions.USER_EXISTS_REQUEST, Actions.USER_EXISTS_SUCCESS, Actions.USER_EXISTS_FAILURE],
    endpoint: ApiRoutes.exists,
    method: 'POST',
    payload: { email },
    meta: { email },
  },
})

export const logout = () => ({
  type: Actions.LOGOUT_USER,
})
export const logoutRequest = () => ({
  type: CALL_API,
  payload: {
    types: [Actions.LOGOUT_REQUEST, Actions.LOGOUT_SUCCESS, Actions.LOGOUT_FAILURE],
    endpoint: ApiRoutes.logout,
    method: 'POST',
  },
})

export const dispatchLogin = (payload: { email: string, password: string }) => async (dispatch: ThunkDispatch<{}, {}, StandardAction<APIPayload<any>>>) => dispatch(login(payload))

export const dispatchLogout = () => async (dispatch: ThunkDispatch<{}, {}, StandardAction<APIPayload<any>>>) => dispatch(logout())

export const dispatchUserExists = (email: string ) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => dispatch(userExists(email))

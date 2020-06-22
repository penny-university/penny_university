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
  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE: 'UPDATE_USER_FAILURE',
  RESEND_VERIFY_EMAIL_REQUEST: 'RESEND_VERIFY_EMAIL_REQUEST',
  RESEND_VERIFY_EMAIL_SUCCESS: 'RESEND_VERIFY_EMAIL_SUCCESS',
  RESEND_VERIFY_EMAIL_FAILURE: 'RESEND_VERIFY_EMAIL_FAILURE',
  VERIFY_EMAIL_REQUEST: 'VERIFY_EMAIL_REQUEST',
  VERIFY_EMAIL_SUCCESS: 'VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE: 'VERIFY_EMAIL_FAILURE',
  REQUEST_PASSWORD_RESET_REQUEST: 'REQUEST_PASSWORD_RESET_REQUEST',
  REQUEST_PASSWORD_RESET_SUCCESS: 'REQUEST_PASSWORD_RESET_SUCCESS',
  REQUEST_PASSWORD_RESET_FAILURE: 'REQUEST_PASSWORD_RESET_FAILURE',
  RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILURE: 'RESET_PASSWORD_FAILURE',
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
    meta: { email: payload.email },
  },
})


export const userExists = (email: string) => ({
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

export const resendVerifyEmail = (email: string) => ({
  type: CALL_API,
  payload: {
    types: [Actions.RESEND_VERIFY_EMAIL_REQUEST, Actions.RESEND_VERIFY_EMAIL_SUCCESS, Actions.RESEND_VERIFY_EMAIL_FAILURE],
    endpoint: ApiRoutes.resendEmail,
    payload: { email },
    method: 'POST',
  },
})

export const verifyEmail = (payload: {token: string, email: string }) => ({
  type: CALL_API,
  payload: {
    types: [Actions.VERIFY_EMAIL_REQUEST, Actions.VERIFY_EMAIL_SUCCESS, Actions.VERIFY_EMAIL_FAILURE],
    endpoint: ApiRoutes.verifyEmail,
    payload,
    method: 'POST',
  },
})


export const dispatchLogin = (payload: { email: string, password: string }) => async (dispatch: ThunkDispatch<{}, {}, StandardAction<APIPayload<any>>>) => dispatch(login(payload))

export const dispatchLogout = () => async (dispatch: ThunkDispatch<{}, {}, StandardAction<APIPayload<any>>>) => dispatch(logout())

export const updateUser = (payload: {firstName: string, lastName: string}, id: string) => ({
  type: CALL_API,
  payload: {
    types: [Actions.UPDATE_USER_REQUEST, Actions.UPDATE_USER_SUCCESS, Actions.UPDATE_USER_FAILURE],
    endpoint: ApiRoutes.updateUser(id),
    method: 'PATCH',
    payload,
  },
})


export const requestPasswordReset = (payload: {email: string}): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.REQUEST_PASSWORD_RESET_REQUEST, Actions.REQUEST_PASSWORD_RESET_SUCCESS, Actions.REQUEST_PASSWORD_RESET_FAILURE],
    endpoint: ApiRoutes.requestPasswordReset,
    method: 'POST',
    payload,
    meta: { email: payload.email },
  }
})

export const resetPassword = (payload: {uid: string, token: string, newPassword1: string, newPassword2: string}): AnyAction => ({
  type: CALL_API,
  payload: {
    types: [Actions.RESET_PASSWORD_REQUEST, Actions.RESET_PASSWORD_SUCCESS, Actions.RESET_PASSWORD_FAILURE],
    endpoint: ApiRoutes.resetPassword,
    method: 'POST',
    payload,
  }
})

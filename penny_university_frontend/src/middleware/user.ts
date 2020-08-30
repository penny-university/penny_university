import {
  MiddlewareAPI, Dispatch, Middleware, AnyAction,
} from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { push } from 'connected-react-router'
import * as Sentry from '@sentry/browser'
import {
  setToken, fetchUser, Actions, logoutRequest,
} from '../actions/user'
import { loadChatsList } from '../actions/chat'
import CookieHelper from '../helpers/cookie'
import modalDispatch from '../components/modal/dispatch'
import ApiRoutes, { Routes } from '../constants'

const logout = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  CookieHelper.clearCookies()
  dispatch(logoutRequest())
}

const checkAuth = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  const token = CookieHelper.getToken()
  if (token) {
    dispatch(setToken(token))
    dispatch(fetchUser())
  }
}

const user : Middleware<Dispatch> = (store: MiddlewareAPI) => (next: (action: AnyAction) => void) => (action: AnyAction) => {
  const { status } = action?.payload || { status: undefined }
  switch (action.type) {
    case Actions.LOGOUT_USER:
      logout(store.dispatch)
      Sentry.configureScope((scope) => {
        scope.clear()
      })
      break
    case Actions.BOOTSTRAP:
      checkAuth(store.dispatch)
      store.dispatch(loadChatsList(ApiRoutes.chats))
      break
    case Actions.SIGNUP_SUCCESS:
      modalDispatch.verifyEmail(action.payload.meta.email)
      break
    case Actions.LOGIN_SUCCESS:
      CookieHelper.setToken(action.payload.result.key)
      store.dispatch(setToken(action.payload.result.key))
      store.dispatch(fetchUser())
      modalDispatch.close()
      break
    case Actions.FETCH_USER_SUCCESS:
      // Load data
      const pk = action.payload.result.pk.toString() // eslint-disable-line no-case-declarations
      store.dispatch(loadChatsList(ApiRoutes.userChats(pk), pk))
      Sentry.configureScope((scope) => {
        scope.setUser({ id: pk })
      })
      break
    case Actions.USER_EXISTS_SUCCESS:
      modalDispatch.authPassword(action.payload.meta.email)
      break
    case Actions.USER_EXISTS_FAILURE:
      if (status === 403) {
        modalDispatch.verifyEmail(action.payload.meta.email)
      } else {
        modalDispatch.authSignup(action.payload.meta.email)
      }
      break
    case Actions.VERIFY_EMAIL_SUCCESS:
      modalDispatch.auth()
      break
    case Actions.REQUEST_PASSWORD_RESET_SUCCESS:
      modalDispatch.authPasswordReset(action.payload.meta.email)
      break
    case Actions.RESET_PASSWORD_SUCCESS:
      store.dispatch(push(`${Routes.ResetPassword}?status=success`))
      break
    default:
  }
  return next(action)
}
export default user

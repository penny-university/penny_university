import {
  MiddlewareAPI, Dispatch, Middleware, AnyAction,
} from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { push } from 'connected-react-router'
import {
  setToken, fetchUser, Actions, logoutRequest,
} from '../actions/user.ts'
import { loadChatsList } from '../actions/chat.ts'
import CookieHelper from '../helpers/cookie.ts'
import modalDispatch from '../components/modal/dispatch.ts'
import ApiRoutes, { Routes } from '../constants/index.ts'

const logout = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  CookieHelper.clearCookies()
  dispatch(logoutRequest())
}

const checkAuth = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const token = CookieHelper.getToken()
  if (token) {
    dispatch(setToken(token))
    dispatch(fetchUser())
  }
}

const user : Middleware<Dispatch> = (store: MiddlewareAPI) => (next: (action: AnyAction) => void) => (action: AnyAction) => {
  switch (action.type) {
    case Actions.LOGOUT_USER:
      logout(store.dispatch)
      break
    case Actions.BOOTSTRAP:
      checkAuth(store.dispatch)
      store.dispatch(loadChatsList(ApiRoutes.chats))
      break
    case Actions.SIGNUP_SUCCESS:
      modalDispatch.verifyEmail(action.payload.meta.email, action.payload.meta.followUp)
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
      break
    case Actions.USER_EXISTS_SUCCESS:
      modalDispatch.authPassword(action.payload.meta.email, action.payload.meta.followUp)
      break
    case Actions.USER_EXISTS_FAILURE:
      if (action.payload.status === 403) {
        modalDispatch.verifyEmail(action.payload.meta.email, action.payload.meta.followUp)
      } else {
        modalDispatch.authSignup(action.payload.meta.email, action.payload.meta.followUp)
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

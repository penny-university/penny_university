import { MiddlewareAPI, Dispatch, Middleware, AnyAction } from "redux"
import { ThunkDispatch } from 'redux-thunk'
import {
  setToken, fetchUser, LOGOUT_USER, CHECK_AUTH, LOGIN_SUCCESS, SIGNUP_SUCCESS, USER_EXISTS_SUCCESS, USER_EXISTS_FAILURE, logoutRequest,
} from '../actions/user'
import CookieHelper from '../helpers/cookie'
import modalDispatch from '../components/modal/dispatch'

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
    case LOGOUT_USER:
      logout(store.dispatch)
      break
    case CHECK_AUTH:
      checkAuth(store.dispatch)
      break
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      CookieHelper.setToken(action.payload.result.key)
      store.dispatch(setToken(action.payload.result.key))
      store.dispatch(fetchUser())
      modalDispatch.close()
      break
    case USER_EXISTS_SUCCESS:
      modalDispatch.authPassword(action.payload.meta.email)
      break
    case USER_EXISTS_FAILURE:
      modalDispatch.authSignup(action.payload.meta.email)
      break
    default:
  }
  return next(action)
}
export default user

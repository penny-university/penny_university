
import {
  setToken, fetchUser, LOGOUT_USER, CHECK_AUTH, LOGIN_SUCCESS, SIGNUP_SUCCESS, logoutRequest,
} from '../actions/user'
import CookieHelper from '../helpers/cookie'
import modalDispatch from '../components/modal/dispatch'

const logout = (dispatch) => {
  CookieHelper.clearCookies()
  dispatch(logoutRequest())
}

const checkAuth = (dispatch) => {
  const token = CookieHelper.getToken()
  if (token) {
    dispatch(setToken(token))
    dispatch(fetchUser())
  }
}

export default (store) => (next) => (action) => {
  switch (action.type) {
    case LOGOUT_USER:
      logout(store.dispatch)
      break
    case CHECK_AUTH:
      checkAuth(store.dispatch)
      break
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      CookieHelper.setToken(action.response.key)
      store.dispatch(setToken(action.response.key))
      store.dispatch(fetchUser())
      modalDispatch.close()
      break
    default:
  }
  return next(action)
}

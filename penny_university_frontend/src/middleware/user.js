
import { setToken, fetchUser, LOGOUT_USER, CHECK_AUTH } from '../actions/user'
import CookieHelper from '../helpers/cookie'


const logout = () => {
  CookieHelper.clearCookies()
}

const checkAuth = (dispatch) => { 
  const token = CookieHelper.getToken()
  if (token) {
    dispatch(setToken(token))
    dispatch(fetchUser())
  }
}

export default (store) => (next) => action => {
  switch (action.type) {
    case LOGOUT_USER:
        logout()
        break
    case CHECK_AUTH:
        checkAuth(store.dispatch)
        break
    default:
    }
  return next(action)
}

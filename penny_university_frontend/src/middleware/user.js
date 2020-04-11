
import { setToken, fetchUser, LOGOUT_USER, CHECK_AUTH } from '../actions/user'
import CookieHelper from '../helpers/cookie'


const logout = () => new Promise((resolve) => {
    CookieHelper.clearCookies()
    resolve()
})

const checkAuth = (store, next) => new Promise((resolve) => {
    const token = CookieHelper.getToken()
    if (token) {
        next(setToken(token))
        store.dispatch(fetchUser())
    }
    resolve()
})

export default (store) => (next) => action => {
    let thunk
    switch (action.type) {
        case LOGOUT_USER:
            thunk = logout()
            break
        case CHECK_AUTH:
            thunk = checkAuth(store, next)
            break
        default:
            thunk = Promise.resolve()
        }
        return thunk
}

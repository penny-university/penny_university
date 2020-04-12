import {checkAuth, dispatchLogout, FETCH_USER_REQUEST, SET_TOKEN, CHECK_AUTH, LOGOUT_REQUEST, LOGOUT_SUCCESS} from '../actions/user'
import fetchMock from 'fetch-mock'
import {makeMockStore, baseUrl} from './config'

describe('auth flow', () => {
  beforeEach(()=> {
    document.cookie = ''
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should do nothing if token doesnt exist', () => {
    document.cookie = ''
    const store = makeMockStore()

    const expectedActionTypes = [CHECK_AUTH]
    store.dispatch(checkAuth())

    expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
  })

  it('should fetch user if token exists', () => {
    document.cookie = 'token=token;'
    fetchMock.getOnce(baseUrl + 'me/', {
      body: { user: {}},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore()

    const expectedActionTypes = [SET_TOKEN, FETCH_USER_REQUEST, CHECK_AUTH]
    store.dispatch(checkAuth())
    expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
  })

  it('should delete token on logout', () => {
    document.cookie = 'token=token;'
    fetchMock.getOnce(baseUrl + 'auth/logout/', {
      body: { user: {}},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore()

    const expectedActionTypes = [LOGOUT_REQUEST, LOGOUT_SUCCESS]
    return store.dispatch(dispatchLogout()).then(() => {
      expect(document.cookie).toEqual("")
      expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })
})

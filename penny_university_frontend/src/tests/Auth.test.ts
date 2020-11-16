import fetchMock from 'fetch-mock'
import {
  bootstrap, dispatchLogout, Actions,
} from '../actions/user'
import ApiRoutes from '../constants'
import { makeMockStore, baseUrl } from './config'
import { chats } from './data'

describe('auth flow', () => {
  beforeEach(() => {
    document.cookie = ''
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should only fetch chats if token doesnt exist', () => {
    document.cookie = ''
    const store = makeMockStore()

    const expectedActionTypes = [Actions.BOOTSTRAP]
    store.dispatch(bootstrap())

    expect(store.getActions().map((a) => a.type)).toEqual(expectedActionTypes)
  })

  it('should fetch user if token exists', () => {
    document.cookie = 'token=token;'
    fetchMock.getOnce(`${baseUrl}${ApiRoutes.user}`, {
      body: { user: {} },
      headers: { 'content-type': 'application/json' },
    })
    fetchMock.getOnce(`${baseUrl}chats/?upcoming_or_popular=true`, {
      body: { results: chats },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedActionTypes = [
      Actions.SET_TOKEN, Actions.FETCH_USER_REQUEST, Actions.BOOTSTRAP,
    ]
    store.dispatch(bootstrap())
    expect(store.getActions().map((a) => a.type)).toEqual(expectedActionTypes)
  })

  it('should delete token on logout', () => {
    document.cookie = 'token=token;'
    fetchMock.postOnce(`${baseUrl}auth/logout/`, {
      body: { user: {} },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedActionTypes = [Actions.LOGOUT_REQUEST, Actions.LOGOUT_USER]
    // @ts-ignore
    return store.dispatch(dispatchLogout()).then(() => {
      expect(document.cookie).toEqual('')
      expect(store.getActions().map((a) => a.type)).toEqual(expectedActionTypes)
    })
  })
})

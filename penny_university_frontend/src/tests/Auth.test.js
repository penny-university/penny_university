import {checkAuth, FETCH_USER_REQUEST, SET_TOKEN, CHECK_AUTH} from '../actions/user'
import fetchMock from 'fetch-mock'
import user from '../middleware/user'
import api from '../middleware/api'
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

    return expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
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
    return expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
  })
})

import {dispatchCheckAuth, CHECK_AUTH, SET_TOKEN} from '../actions/user'
import fetchMock from 'fetch-mock'
import { CALL_API } from '../middleware/api'
import user from '../middleware/user'
import {makeMockStore, baseUrl} from './config'

describe('auth flow', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should do nothing if token doesnt exist', () => {
    const cookie = require('../helpers/cookie')
    cookie.getToken = jest.fn(() => null)
    fetchMock.getOnce(baseUrl + 'me/', () => {
      return {}
    })
    const store = makeMockStore({}, [user])

    const expectedActionTypes = []

    return store.dispatch(dispatchCheckAuth()).then(() => {
      expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should fetch user if token exists', () => {
    const cookie = require('../helpers/cookie')
    cookie.getToken = jest.fn(() => 'test')
    fetchMock.getOnce(baseUrl + 'me/', () => {
      return {}
    })

    const store = makeMockStore({})

    const expectedActionTypes = [CHECK_AUTH]

    return store.dispatch(dispatchCheckAuth()).then(() => {
        expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })
})

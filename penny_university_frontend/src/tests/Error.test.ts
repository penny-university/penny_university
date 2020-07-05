import fetchMock from 'fetch-mock'
import { rootReducer as reducer } from '../reducers'
import { makeMockStore, initialState } from './config'
import { loadChatsList } from '../actions/chat'

describe('error reducer', () => {
  fetchMock.get('*', () => {
    throw new Error('It failed!')
  })

  it('should put error message in state', () => {
    const store = makeMockStore()
    // @ts-ignore
    return store.dispatch(loadChatsList('1')).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      expect(state.error).toEqual({ body: 'It failed!', status: undefined, meta: { userID: undefined } })
    })
  })
})

import fetchMock from 'fetch-mock'
import { rootReducer as reducer } from '../reducers/index.ts'
import { makeMockStore, initialState } from './config.tsx'
import { loadChatsList } from '../actions/chat.ts'

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

import fetchMock from 'fetch-mock'
import { loadFollowUps } from '../actions/chat.ts'
import { rootReducer as reducer } from '../reducers/index.ts'
import { makeMockStore, initialState, baseUrl } from './config.tsx'
import { followUps, normalizedFollowUps, users } from './data.ts'

describe('follow up actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should dispatch FOLLOW_UPS_REQUEST and FOLLOW_UPS_SUCCESS', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUps },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedActionTypes = ['FOLLOW_UPS_REQUEST', 'FOLLOW_UPS_SUCCESS']
    // @ts-ignore
    return store.dispatch(loadFollowUps('1')).then(() => {
      expect(store.getActions().map((a) => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch FOLLOW_UPS_REQUEST and FOLLOW_UPS_FAILURE', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore()

    const expectedActions = [
      {
        type: 'FOLLOW_UPS_REQUEST',
        payload: { meta: { chatID: '1' } },
      },
      {
        type: 'FOLLOW_UPS_FAILURE',
        payload: { message: 'It failed!', status: undefined, meta: { chatID: '1' } },
      },
    ]
    // @ts-ignore
    return store.dispatch(loadFollowUps('1')).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

describe('follow up reducers', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should add follow ups to entities', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUps },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()
    // @ts-ignore
    return store.dispatch(loadFollowUps('1')).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.followUps['1']).toEqual(normalizedFollowUps['1'])
    })
  })

  it('should add user profile to entities', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUps },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()
    // @ts-ignore
    return store.dispatch(loadFollowUps('1')).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.users['1']).toEqual(users['1'])
    })
  })

  it('should paginate follow up ids', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUps },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore(initialState)

    const expectedFollowUpIds = followUps.map((f) => f.id.toString())
    // @ts-ignore
    return store.dispatch(loadFollowUps('1')).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      expect(state.pagination.followUpsByChat['1'].ids)
        .toEqual(expectedFollowUpIds)
    })
  })
})

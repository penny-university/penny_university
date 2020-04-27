import fetchMock from 'fetch-mock'
import { loadFollowUps } from '../actions'
import reducer from '../reducers'
import { makeMockStore, initialState, baseUrl } from './config'
import { followUps } from './data'

describe('follow up actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should dispatch FOLLOW_UPS_REQUEST and FOLLOW_UPS_SUCCESS', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUps['http://localhost:8000/api/chats/1/follow-ups'] },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedActionTypes = ['FOLLOW_UPS_REQUEST', 'FOLLOW_UPS_SUCCESS']

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
        chatId: '1',
        type: 'FOLLOW_UPS_REQUEST',
      },
      {
        chatId: '1',
        type: 'FOLLOW_UPS_FAILURE',
        payload: { message: 'It failed!', status: undefined },
      },
    ]

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
    const followUpsForChat = followUps['http://localhost:8000/api/chats/1/follow-ups']
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUpsForChat },
      headers: { 'content-type': 'application/json' },
    })

    // user will be normalized in response
    const expectedFollowUp = { ...followUpsForChat[0], userProfile: 1 }

    const store = makeMockStore()

    return store.dispatch(loadFollowUps('1')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.followUps['1']).toEqual(expectedFollowUp)
    })
  })

  it('should add user profile to entities', () => {
    const followUpsForChat = followUps['http://localhost:8000/api/chats/1/follow-ups']
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUpsForChat },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    return store.dispatch(loadFollowUps('1')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.userProfiles['1']).toEqual(followUpsForChat[0].userProfile)
    })
  })

  it('should paginate follow up ids', () => {
    const followUpsForChat = followUps['http://localhost:8000/api/chats/1/follow-ups']
    fetchMock.getOnce(`${baseUrl}chats/1/follow-ups/`, {
      body: { results: followUpsForChat },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore(initialState)

    const expectedFollowUpIds = followUpsForChat.map((f) => f.id)

    return store.dispatch(loadFollowUps('1')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      expect(state.pagination.followUpsByChat['1'].ids)
        .toEqual(expectedFollowUpIds)
    })
  })
})

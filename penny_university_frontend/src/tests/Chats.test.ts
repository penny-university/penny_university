import fetchMock from 'fetch-mock'
import { loadChatDetail, loadChatsList } from '../actions/chat'
import {rootReducer as  reducer} from '../reducers'
import { makeMockStore, initialState, baseUrl } from './config'
import { chats, chatsNext, normalizedChats, users } from './data'
import ApiRoutes from '../constants'


describe('chat actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should dispatch CHAT_LIST_REQUEST and CHAT_LIST_SUCCESS', () => {
    fetchMock.getOnce(`${baseUrl}chats/`, {
      body: { results: chats },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedActionTypes = ['CHATS_LIST_REQUEST', 'CHATS_LIST_SUCCESS']
    // @ts-ignore
    return store.dispatch(loadChatsList(ApiRoutes.chats)).then(() => {
      expect(store.getActions().map((a) => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch CHAT_LIST_REQUEST and CHAT_LIST_FAILURE', () => {
    fetchMock.getOnce(`${baseUrl}chats/`, () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore()

    const expectedActions = [
      {
        type: 'CHATS_LIST_REQUEST',
        payload: {
          meta: { userID: undefined },
        },
      },
      {
        type: 'CHATS_LIST_FAILURE',
        payload: { body: 'It failed!', status: undefined, meta: { userID: undefined }, },
      },
    ]
    // @ts-ignore
    return store.dispatch(loadChatsList(ApiRoutes.chats)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should dispatch CHAT_DETAIL_REQUEST and CHAT_DETAIL_SUCCESS', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/`, {
      body: { results: chats[1] },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedActionTypes = ['CHAT_DETAIL_REQUEST', 'CHAT_DETAIL_SUCCESS']
    return store.dispatch(loadChatDetail('1')).then(() => {
      expect(store.getActions().map((a) => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch CHAT_DETAIL_REQUEST and CHAT_DETAIL_FAILURE', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/`, () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore()

    const expectedActions = [
      {
        type: 'CHAT_DETAIL_REQUEST',
        payload: { meta: undefined }
      },
      {
        type: 'CHAT_DETAIL_FAILURE',
        payload: { body: 'It failed!', status: undefined },
      },
    ]
    // @ts-ignore
    return store.dispatch(loadChatDetail('1')).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

describe('chat reducers', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should add chats to entities', () => {
    fetchMock.getOnce(`${baseUrl}chats/`, {
      body: { results: chats },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()

    const expectedChat = normalizedChats['1']
    // @ts-ignore
    return store.dispatch(loadChatsList(ApiRoutes.chats)).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.chats['1']).toEqual(expectedChat)
    })
  })

  it('should properly merge more chats in to entities', () => {
    fetchMock.getOnce(`${baseUrl}chats/`, {
      body: { results: chatsNext },
      headers: { 'content-type': 'application/json' },
    })

    // populate what we need from chats
    let state = {
      ...initialState,
      entities: {
        chats: {
          1: {
            id: 1,
          },
          2: {
            id: 2,
          },
        },
      },
    }

    const store = makeMockStore(state)
    // @ts-ignore
    return store.dispatch(loadChatsList(ApiRoutes.chats)).then(() => {
      // @ts-ignore
      state = reducer(state, store.getActions()[1])
      expect(Object.keys(state.entities.chats)).toEqual(['1', '2', '3'])
    })
  })

  it('should add participants to the store as user profiles', () => {
    fetchMock.getOnce(`${baseUrl}chats/1/`, {
      body: { results: chats[0] },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore(initialState)

    const expectedUserProfiles = users
    // @ts-ignore
    return store.dispatch(loadChatDetail('1')).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.users).toEqual(expectedUserProfiles)
    })
  })

  it('should paginate chat ids', () => {
    fetchMock.getOnce(`${baseUrl}chats/`, {
      body: { results: chats },
      headers: { 'content-type': 'application/json' },
    })

    const store = makeMockStore()
    // @ts-ignore
    return store.dispatch(loadChatsList(ApiRoutes.chats)).then(() => {
      // @ts-ignore
      const state = reducer(initialState, store.getActions()[1])
      const expected = chats.map((c) => c.id.toString())
      expect(state.pagination.chatsByFilter.all.ids).toEqual(expected)
    })
  })
})

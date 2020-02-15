import {loadChatDetail, loadChatsList} from '../actions'
import reducer from '../reducers'
import fetchMock from 'fetch-mock'
import {makeMockStore, initialState, baseUrl} from './config'
import {chats} from './data'

describe('chat actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should dispatch CHAT_LIST_REQUEST and CHAT_LIST_SUCCESS', () => {
    fetchMock.getOnce(baseUrl + 'chats/', {
      body: {results: chats},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore(initialState)

    const expectedActionTypes = ['CHATS_LIST_REQUEST', 'CHATS_LIST_SUCCESS']

    return store.dispatch(loadChatsList('all')).then(() => {
      expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch CHAT_LIST_REQUEST and CHAT_LIST_FAILURE', () => {
    fetchMock.getOnce(baseUrl + 'chats/', () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore(initialState)

    const expectedActions = [
      {
        type: 'CHATS_LIST_REQUEST'
      },
      {
        type: 'CHATS_LIST_FAILURE',
        error: 'It failed!'
      }
    ]

    return store.dispatch(loadChatsList('all')).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should dispatch CHAT_DETAIL_REQUEST and CHAT_DETAIL_SUCCESS', () => {
    fetchMock.getOnce(baseUrl + 'chats/1/', {
      body: {results: chats[1]},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore(initialState)

    const expectedActionTypes = ['CHAT_DETAIL_REQUEST', 'CHAT_DETAIL_SUCCESS']

    return store.dispatch(loadChatDetail('1')).then(() => {
      expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch CHAT_DETAIL_REQUEST and CHAT_DETAIL_FAILURE', () => {
    fetchMock.getOnce(baseUrl + 'chats/1/', () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore(initialState)

    const expectedActions = [
      {
        type: 'CHAT_DETAIL_REQUEST'
      },
      {
        type: 'CHAT_DETAIL_FAILURE',
        error: 'It failed!'
      }
    ]

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
    fetchMock.getOnce(baseUrl + 'chats/', {
      body: {results: chats},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore(initialState)

    return store.dispatch(loadChatsList('all')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.chats['2']).toEqual(chats[0])
    })
  })

  it('should paginate chat ids', () => {
    fetchMock.getOnce(baseUrl + 'chats/', {
      body: {results: chats},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore(initialState)

    return store.dispatch(loadChatsList('all')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      const expected = chats.map(c => c.id)
      expect(state.pagination.chatsByFilter['all'].ids).toEqual(expected)
    })
  })
})

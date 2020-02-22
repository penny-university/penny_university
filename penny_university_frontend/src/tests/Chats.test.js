import {loadChatDetail, loadChatsList} from '../actions'
import reducer from '../reducers'
import fetchMock from 'fetch-mock'
import {makeMockStore, initialState, baseUrl} from './config'
import {chats, chats_next} from './data'

describe('chat actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('should dispatch CHAT_LIST_REQUEST and CHAT_LIST_SUCCESS', () => {
    fetchMock.getOnce(baseUrl + 'chats/', {
      body: {results: chats},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore()

    const expectedActionTypes = ['CHATS_LIST_REQUEST', 'CHATS_LIST_SUCCESS']

    return store.dispatch(loadChatsList('all')).then(() => {
      expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch CHAT_LIST_REQUEST and CHAT_LIST_FAILURE', () => {
    fetchMock.getOnce(baseUrl + 'chats/', () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore()

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

    const store = makeMockStore()

    const expectedActionTypes = ['CHAT_DETAIL_REQUEST', 'CHAT_DETAIL_SUCCESS']

    return store.dispatch(loadChatDetail('1')).then(() => {
      expect(store.getActions().map(a => a.type)).toEqual(expectedActionTypes)
    })
  })

  it('should dispatch CHAT_DETAIL_REQUEST and CHAT_DETAIL_FAILURE', () => {
    fetchMock.getOnce(baseUrl + 'chats/1/', () => {
      throw new Error('It failed!')
    })

    const store = makeMockStore()

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

    const store = makeMockStore()

    const expectedChat = {
      "id": 2,
      "url": "http://localhost:8000/api/chats/2/",
      "title": "React Hooks",
      "description": "Learn to make your components functional using hooks",
      "date": "2020-02-02T12:00:00Z",
      "followups": "http://localhost:8000/api/chats/2/follow-ups",
      "participants": [
        {
          "user": 3,
          "role": "Organizer"
        }
      ]
    }

    return store.dispatch(loadChatsList('all')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.chats['2']).toEqual(expectedChat)
    })
  })

  it('should properly merge more chats in to entities', () => {
    fetchMock.getOnce(baseUrl + 'chats/', {
      body: {results: chats_next},
      headers: {'content-type': 'application/json'}
    })

    // populate what we need from chats
    let state = Object.assign({}, initialState, {
      'entities': {
        'chats': {
          '1': {
            'id': 1
          },
          '2': {
            'id': 2
          }
        }
      }
    })

    const store = makeMockStore(state)

    return store.dispatch(loadChatsList('all')).then(() => {
      state = reducer(state, store.getActions()[1])
      expect(Object.keys(state.entities.chats)).toEqual(['1', '2', '3', '4'])
    })
  })

  it('should add participants to the store as users', () => {
    fetchMock.getOnce(baseUrl + 'chats/1/', {
      body: {results: chats[1]},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore(initialState)

    const expectedUsers = {
      '1': {
        'id': 1,
        'url': 'http://localhost:8000/api/users/1/',
        'email': 'test1@example.com',
        'realName': 'Test User 1'
      },
      '2': {
        'id': 2,
        'url': 'http://localhost:8000/api/users/2/',
        'email': 'test2@example.com',
        'realName': 'Test User 2'
      }
    }

    return store.dispatch(loadChatDetail('1')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      expect(state.entities.users).toEqual(expectedUsers)
    })
  })

  it('should paginate chat ids', () => {
    fetchMock.getOnce(baseUrl + 'chats/', {
      body: {results: chats},
      headers: {'content-type': 'application/json'}
    })

    const store = makeMockStore()

    return store.dispatch(loadChatsList('all')).then(() => {
      const state = reducer(initialState, store.getActions()[1])
      const expected = chats.map(c => c.id)
      expect(state.pagination.chatsByFilter['all'].ids).toEqual(expected)
    })
  })
})

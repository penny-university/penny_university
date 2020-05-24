import { normalize } from 'normalizr'
import { AnyAction } from 'redux'
import * as ActionTypes from '../actions'

export const paginationInitialState = {
  chatsByFilter: {
    all: {
      isFetching: false,
      next: '',
      previous: '',
      count: 0,
      ids: [],
    }
  },
  followUpsByChat: {},
}

// Takes two arrays and returns the union between them as a new array
const union = (a: Iterable<any>, b: Iterable<any>) => (
  [...new Set([...a, ...b])]
)

// Reducer for handling actions that require pagination.
// Requires three types (request, success, and failure),
// and a function to map the pagination to a key, e.g. (action) => action.filterName.
const paginate = ({ types, mapActionToKey }: { types: [Array<string>, Array<string>, Array<string>], mapActionToKey: (action: AnyAction) => string | undefined }) => {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.')
  }
  if (!types.every((t) => Array.isArray(t))) {
    throw new Error('Expected types to be strings.')
  }
  if (typeof mapActionToKey !== 'function') {
    throw new Error('Expected mapActionToKey to be a function.')
  }

  const [requestTypes, successTypes, failureTypes] = types

  const updatePagination = (state = {
    isFetching: false,
    next: undefined,
    previous: undefined,
    count: 0,
    ids: Array(),
  }, action: AnyAction) => {
    const { result, responseSchema } = action.payload || {}
      if(requestTypes.includes(action.type)){
        return {
          ...state,
          isFetching: true,
        }
       } else if (successTypes.includes(action.type)){
        if (responseSchema) {
          let { result: resultIds } = normalize(result, responseSchema)
          if (typeof resultIds === 'string') {
            resultIds = [resultIds]
          }
          return {
            ...state,
            isFetching: false,
            ids: union(state.ids, resultIds),
            next: action.payload?.meta.next,
            previous: action.payload?.meta.previous,
            count: action.payload?.meta.count,

          }
        }
        return state
      case failureType:
        return {
          ...state,
          isFetching: false,
        }
      }
      return state
    }

  return (state = paginationInitialState, action: AnyAction): PaginationState => {
    // Update pagination by key
    const key = mapActionToKey(action)
        if (key) {
          return {
            ...state,
            // @ts-ignore
            [key]: updatePagination(state[key], action),
          }
        }
        return state
      default:
        return state
  }
}

export default paginate

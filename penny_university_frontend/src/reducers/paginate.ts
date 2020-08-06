import { normalize } from 'normalizr'
import { AnyAction } from 'redux'
import { ChatActions } from '../actions';

export const paginationInitialState = {
  chatsByFilter: {
    all: {
      isFetching: false,
      next: '',
      previous: '',
      count: 0,
      ids: [],
    },
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
const paginate = ({ types, mapActionToKey }:
  {
    types: {
      requestTypes: Array<string>, successTypes: Array<string>, failureTypes: Array<string>, deleteTypes: Array<string>
    },
    mapActionToKey: (action: AnyAction) => string | undefined
  }) => {
  if (typeof mapActionToKey !== 'function') {
    throw new Error('Expected mapActionToKey to be a function.')
  }

  const {
    requestTypes, successTypes, failureTypes, deleteTypes,
  } = types

  const updatePagination = (
    state: {isFetching: boolean, next: string | undefined, previous: string | undefined, count: number, ids: any[]} = {
      isFetching: false,
      next: undefined,
      previous: undefined,
      count: 0,
      ids: [],
    }, action: AnyAction,
  ) => {
    const { result, responseSchema } = action.payload || {}
    if (requestTypes.includes(action.type)) {
      return {
        ...state,
        isFetching: true,
      }
    } if (successTypes.includes(action.type)) {
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
    } else if (failureTypes.includes(action.type)) {
      return {
        ...state,
        isFetching: false,
      }
    } else if (deleteTypes.includes(action.type)) {
      if (action.type === ChatActions.DELETE_FOLLOW_UP_SUCCESS) {
        const index = state.ids.indexOf(action.payload?.meta?.followUpID.toString())
        const newState = { ...state }
        newState.ids.splice(index, 1)
        return {
          ...newState,
          isFetching: false,
        }
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
  }
}

export default paginate

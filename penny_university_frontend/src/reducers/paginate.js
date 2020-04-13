// Takes two arrays and returns the union between them as a new array
const union = (a, b) => (
  [...new Set([...a, ...b])]
)

// Reducer for handling actions that require pagination.
// Requires three types (request, success, and failure),
// and a function to map the pagination to a key, e.g. (action) => action.filterName.
const paginate = ({ types, mapActionToKey }) => {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.')
  }
  if (!types.every((t) => typeof t === 'string')) {
    throw new Error('Expected types to be strings.')
  }
  if (typeof mapActionToKey !== 'function') {
    throw new Error('Expected mapActionToKey to be a function.')
  }

  const [requestType, successType, failureType] = types

  const updatePagination = (state = {
    isFetching: false,
    nextPageUrl: undefined,
    pageCount: 0,
    ids: [],
  }, action) => {
    const { result } = action.response
    switch (action.type) {
      case requestType:
        return {
          ...state,
          isFetching: true,
        }
      case successType:
        return {
          ...state,
          isFetching: false,
          ids: union(state.ids, result),
          nextPageUrl: action.response.nextPageUrl,
          pageCount: state.pageCount + 1,
        }
      case failureType:
        return {
          ...state,
          isFetching: false,
        }
      default:
        return state
    }
  }

  return (state = {}, action) => {
    // Update pagination by key
    const key = mapActionToKey(action)
    switch (action.type) {
      case requestType:
      case successType:
      case failureType:
        return {
          ...state,
          [key]: updatePagination(state[key], action),
        }
      default:
        return state
    }
  }
}

export default paginate

import { RootState } from '../reducers/index.ts'

const getPaginationStore = (state: RootState) => state.pagination

// @ts-ignore
const isFetchingChats = (state: RootState, key: string): boolean => {
  const pager = getPaginationStore(state).chatsByFilter[key]
  if (pager) {
    // @ts-ignore
    return pager?.isFetching
  }
  return false
}

const getChatsPagination = (state: RootState, filter: string):
{ ids: Array<string>, next: string | null } => {
  const chatsPagination = getPaginationStore(state).chatsByFilter[filter]
  // @ts-ignore
  return { ids: chatsPagination?.ids || [], next: chatsPagination?.next }
}

export {
  isFetchingChats,
  getChatsPagination,
}

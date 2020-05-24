import { RootState } from '../reducers'

const getPaginationStore = (state: RootState) => state.pagination

// @ts-ignore
const isFetchingChats = (state: RootState) => getPaginationStore(state).chatsByFilter?.all.isFetching


const getChatsPagination = (state: RootState, filter: string): { ids: Array<string>, next: string | null } => {
  const chatsPagination = getPaginationStore(state).chatsByFilter[filter]
  // @ts-ignore
  return { ids: chatsPagination?.ids || [], next: chatsPagination?.next }
}


export {
  isFetchingChats,
  getChatsPagination
}
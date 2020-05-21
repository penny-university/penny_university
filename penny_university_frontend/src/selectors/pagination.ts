import { RootState } from '../reducers'

const getPaginationStore = (state: RootState) => state.pagination

// @ts-ignore
const isFetchingChats = (state: RootState) => getPaginationStore(state).chatsByFilter?.all.isFetching

export {
  isFetchingChats
}
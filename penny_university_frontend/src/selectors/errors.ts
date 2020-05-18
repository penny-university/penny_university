import { RootState } from '../reducers'

const getError = (store: RootState) => store.error

const getErrorStatus = (store: RootState) => getError(store)?.status

const getErrorMessage = (store: RootState) => getError(store)?.message

export {
  getError,
  getErrorMessage,
  getErrorStatus,
}

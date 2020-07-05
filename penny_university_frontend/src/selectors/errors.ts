import { RootState } from '../reducers/index.ts'

const getError = (store: RootState) => store.error

const getErrorStatus = (store: RootState) => getError(store)?.status

const getErrorMessages = (store: RootState) => getError(store)?.body

export {
  getError,
  getErrorMessages,
  getErrorStatus,
}

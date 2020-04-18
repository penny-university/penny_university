
const getError = (store) => store.error

const getErrorStatus = (store) => getError(store)?.status

const getErrorMessage = (store) => getError(store)?.message

export {
  getError,
  getErrorMessage,
  getErrorStatus,
}

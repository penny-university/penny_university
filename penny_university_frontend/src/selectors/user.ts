import{ RootState } from '../reducers'

const getUserStore = (store: RootState) => store.user

const getToken = (store: RootState) => getUserStore(store).token

const getAuthed = (store: RootState) => !!getUserStore(store).user

const getUser = (store: RootState) => !!getUserStore(store).user

export {
  getToken,
  getAuthed,
  getUser,
}

import{ RootState } from '../reducers'
import User from '../models/user'

const getUserStore = (store: RootState) => store.user

const getToken = (store: RootState) => getUserStore(store).token

const getAuthed = (store: RootState) => !!getUserStore(store).user

const getUser = (store: RootState): User => getUserStore(store).user || new User()

export {
  getToken,
  getAuthed,
  getUser,
}


const getUserStore = (store) => store.user

const getToken = (store) => getUserStore(store).token

const getAuthed = (store) => !!getUserStore(store).user

const getUser = (store) => getUserStore(store).user

export {
  getToken,
  getAuthed,
  getUser,
}

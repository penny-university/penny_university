
const getUserStore = (store) => store.user

const getToken = (store) => getUserStore(store).token

export {
  getToken,
}

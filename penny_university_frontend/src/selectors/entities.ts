import{ RootState } from '../reducers'

const getChats = (state: RootState) => state.entities.chats

const getFollowUps = (state: RootState) => state.entities.followUps

const getUsers = (state: RootState) => state.entities.users

const getUserByID = (state: RootState, id: string) => getUsers(state)[id]

export {
  getChats,
  getFollowUps,
  getUsers,
  getUserByID,
}
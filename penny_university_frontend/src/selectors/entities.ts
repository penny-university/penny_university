import { RootState } from '../reducers'
import { User } from '../models'
import { getUser } from './user'

const getChats = (state: RootState) => state.entities.chats

const getFollowUps = (state: RootState) => state.entities.followUps

const getUsers = (state: RootState) => state.entities.users

const getUserByID = (state: RootState, id: string) => {
  let account: Account | User = getUsers(state)[id]
  // Until the logged in user creates their first follow up they won't get normalized as an entity
  // In this case we fallback to the user
  if (!account) {
    const user = getUser(state)
    if (user.id.toString() === id.toString()) {
      account = user
    }
  }
  return account
}

export {
  getChats,
  getFollowUps,
  getUsers,
  getUserByID,
}

import { RootState } from '../reducers/index.ts'
import * as selectEntities from './entities.ts'
import Chat from '../models/chat.ts'

const getChatByID = (state: RootState, id: number) => {
  const chats = selectEntities.getChats(state)
  const chat = chats[id]
  if (chat) {
    // Make sure Participants are always sorted with Organizer first
    chat.participants.sort((a: Participant, b: Participant) => {
      if (a.role === 'Organizer') return -1
      if (b.role === 'Participant') return 1
      return 0
    })
  }
  return chat || new Chat()
}

const getFollowupsForChatID = (state: RootState, id: number) => {
  const followUps = selectEntities.getFollowUps(state)
  const followUpsPagination = state.pagination.followUpsByChat[id] || { ids: [] }
  // @ts-ignore
  const followUpsList = followUpsPagination.ids.map((id: number) => {
    const followUp = followUps[id]
    return followUp
  })
  return followUpsList
}

export {
  getChatByID,
  getFollowupsForChatID,
}

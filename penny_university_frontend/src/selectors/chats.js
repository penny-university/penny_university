import * as selectEntities from './entities'

const getChatById = (state, id) => {
  const chats = selectEntities.getChats(state)
  const userProfiles = selectEntities.getUserProfiles(state)
  const chat = chats[id]
  if (chat) {
    // if userProfile is just an ID, populate the full userProfile
    chat.participants = chat.participants.map((c) => ((typeof (c.userProfile) === 'number') ? { userProfile: userProfiles[c.userProfile], role: c.role } : c))
  }
  return chat
}

const decorateUserProfileWithRole = (chat, userProfile) => {
  if (chat && userProfile) {
    const participant = chat.participants.find((p) => p.userProfile?.id === userProfile?.id)
    return participant ? participant.role : null
  }
  return null
}

const getFollowupsForChatId = (state, id) => {
  const followUps = selectEntities.getFollowUps(state)
  const followUpsPagination = state.pagination.followUpsByChat[id] || { ids: [] }
  const followUpsList = followUpsPagination.ids.map((id) => {
    const followUp = followUps[id]
    return followUp
  })
  return followUpsList
}


export {
  getChatById,
  getFollowupsForChatId,
}
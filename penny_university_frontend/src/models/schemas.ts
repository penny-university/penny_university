import { schema } from 'normalizr'
import Chat, { ChatType } from './chat'
import User, { UserType } from './user'
import FollowUp, { FollowUpType } from './followUp';

const userSchema = new schema.Entity('users', {}, {
  idAttribute: (user: User) => user.id.toString(),
  processStrategy: (value: UserType) => new User(value),
  mergeStrategy: (a: User) => a,
})

const chatSchema = new schema.Entity('chats', {
  participants: [{
    user: userSchema,
  }],
}, {
  idAttribute: (chat: ChatType) => chat.id.toString(),
  processStrategy: (value: ChatType) => new Chat(value),
})

const followUpSchema = new schema.Entity('followUps', {
  pennyChat: chatSchema,
  user: userSchema,
}, {
  idAttribute: (followUp: FollowUp) => followUp.id.toString(),
  processStrategy: (value: FollowUpType) => new FollowUp(value),
})

// Schemas for the responses from the API
export const Schemas = {
  CHAT: chatSchema,
  CHAT_ARRAY: [chatSchema],
  USER: userSchema,
  USER_ARRAY: [userSchema],
  FOLLOW_UP: followUpSchema,
  FOLLOW_UP_ARRAY: [followUpSchema],
}

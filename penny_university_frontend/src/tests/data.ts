import { normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import chatDetail from '../../../__mocks__/api-chats-get-1-200.json'
import chatList from '../../../__mocks__/api-chats-get-200.json'
import followUpsList from '../../../__mocks__/api-chats-get-1-follow-ups-200.json'
import { User } from '../models'
import { Schemas } from '../models/schemas'

export const chats = camelizeKeys(chatList.results.slice(2,3))
export const chatsNext = camelizeKeys(chatList.results.slice(0,1))
export const followUps = camelizeKeys(followUpsList)

export const { chats: normalizedChats, users } = normalize(chats, Schemas.CHAT_ARRAY).entities

export const { chats: normalizedNextChats } = normalize(chatsNext, Schemas.CHAT_ARRAY).entities


export const { followUps: normalizedFollowUps}  = normalize(followUps, Schemas.FOLLOW_UP_ARRAY).entities

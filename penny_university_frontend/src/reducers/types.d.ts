type StandardAction<P> = { type: string, payload?: P }

type User = {

}

type UserState = {
  user: User | null,
  token: string | null,
}

type Chat = {
  id: string,
  title: string,
  date: string,
  description: string,
  participants: Array<Participant>,
}

type UserProfile = {
  realName: string,
  id: string,
  role: 'Participant' | 'Organizer',
}

type Participant = {
  userProfile: UserProfile,
  role: 'Participant' | 'Organizer',
}

type FollowUp = {
  id: string,
  content: string,
  userProfile: UserProfile,
  date: string,
}

type EntityState = {
  chats: {
    [key: string]: Chat
  },
  followUps: {
    [key: string]: FollowUp
  },
  userProfiles: {
    [key: string]: UserProfile
  },
}

type PaginationState = {
  chatsByFilter: {
    all: {
      nextPageUrl: string,
      pageCount: number,
      data: Array<Chat>,
    }
  },
  followUpsByChat: {
    [key: string]: {
      nextPageUrl: string,
      pageCount: number,
      data: Array<Chat>,
    }
  },
}

type ErrorState = {
  status: number,
  message: string,
}

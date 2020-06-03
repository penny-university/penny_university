type StandardAction<P> = { type: string, payload?: P }

interface UserState {
  user: User | null,
  token: string | null,
}

interface Participant {
  user: number,
  role: 'Participant' | 'Organizer',
}

interface Account {
  chats: string,
  email: string,
  firstName: string,
  id: number,
  lastName: string,
  url: string,
}

interface EntityState {
  chats: {
    [key: string]: Chat
  },
  followUps: {
    [key: string]: FollowUp
  },
  users: {
    [key: string]: Account
  },
}

interface PaginationState {
  chatsByFilter: {
    all: {
      next: string | undefined,
      previous: string | undefined,
      count: number,
      ids: Array<Chat>,
    }
  },
  followUpsByChat: {
    [key: string]: {
      next: string | undefined,
      previous: string | undefined,
      count: number,
      ids: Array<Chat>,
    }
  },
}

interface ErrorState {
  status: number,
  message: string,
}

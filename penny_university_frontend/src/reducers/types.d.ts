type StandardAction<P> = { type: string, payload?: P }

interface UserState {
  user: User | null,
  token: string | null,
}

interface Participant {
  user: number,
  role: 'Participant' | 'Organizer',
}

interface FollowUp {
  id: number,
  content: string,
  user: number,
  date: string,
  pennyChat: string,
  url: string,
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

interface ErrorState {
  status: number,
  message: string,
}

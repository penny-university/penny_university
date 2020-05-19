import { User } from '../models'

export const chats = [
  {
    id: 2,
    url: 'http://localhost:8000/api/chats/2/',
    title: 'React Hooks',
    description: 'Learn to make your components functional using hooks',
    date: '2020-02-02T12:00:00Z',
    followups: 'http://localhost:8000/api/chats/2/follow-ups',
    participants: [
      {
        user: new User({
          id: 3,
          firstName: 'Test',
          lastName: 'User 3'
        }),
        role: 'Organizer',
      },
    ],
  },
  {
    id: 1,
    url: 'http://localhost:8000/api/chats/1/',
    title: 'Testing with React/Redux',
    description: 'Learning to test front end applications',
    date: '2020-01-01T12:00:00Z',
    followups: 'http://localhost:8000/api/chats/1/follow-ups',
    participants: [
      {
        user: new User({
          id: 1,
          firstName: 'Test',
          lastName: 'User 1'
        }),
        role: 'Organizer',
      },
      {
        user: new User({
          id: 2,
          firstName: 'Test',
          lastName: 'User 2',
        }),
        role: 'Attendee',
      },
    ],
  },
]

export const chatsNext = [
  {
    id: 4,
    url: 'http://localhost:8000/api/chats/4/',
    title: 'The 4th chat',
    description: '',
    date: '2020-04-04T12:00:00Z',
    followups: 'http://localhost:8000/api/chats/4/follow-ups',
    participants: [
      {
        user: new User({
          id: 3,
          url: 'http://localhost:8000/api/users/3/',
          email: 'test3@gmail.com',
          firstName: 'Test',
          lastName: 'User 3',
        }),
        role: 'Organizer',
      },
    ],
  },
  {
    id: 3,
    url: 'http://localhost:8000/api/chats/3/',
    title: 'The 3rd chat',
    description: 'This is the third list in the chat',
    date: '2020-03-03T12:00:00Z',
    followups: 'http://localhost:8000/api/chats/3/follow-ups',
    participants: [
      {
        user: new User({
          id: 1,
          url: 'http://localhost:8000/api/users/1/',
          email: 'test1@example.com',
          firstName: 'Test',
          lastName: 'User 1',
        }),
        role: 'Organizer',
      },
    ],
  },
]

export const followUps = {
  'http://localhost:8000/api/chats/1/follow-ups': [
    {
      id: 1,
      pennyChat: 'http://localhost:8000/api/chats/1/',
      content: 'In this chat we learned how to user Jest to test our React and Redux apps.',
      date: '2020-01-01T13:00:00Z',
      user: new User({
        id: 1,
        url: 'http://localhost:8000/api/users/1/',
        firstName: 'Test',
        lastName: 'User 1',
      }),
    },
    {
      id: 2,
      pennyChat: 'http://localhost:8000/api/chats/1/',
      content: 'Test User 1 had great insight into this topic.',
      date: '2020-01-01T14:00:00Z',
      user: new User({
        id: 2,
        url: 'http://localhost:8000/api/users/2/',
        firstName: 'Test',
        lastName: 'User 2',
      }),
    },
  ],
  'http://localhost:8000/api/chats/2/follow-ups': [
    {
      id: 3,
      pennyChat: 'http://localhost:8000/api/chats/2/',
      content: 'I learned that hooks can replace lots of the boilerplate I used to have in my class components!',
      date: '2019-11-20T22:30:34Z',
      user: new User({
        id: 3,
        url: 'http://localhost:8000/api/users/3/',
        firstName: 'Test',
        lastName: 'User 3',
      }),
    },
  ],
}

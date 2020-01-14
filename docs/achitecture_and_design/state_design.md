# Redux State Design

The following describes the shape of our state as it will be kept in Redux.
[The Redux docs suggest](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape/#normalizing-state-shape) 
keeping the data normalized.

```javascript
state = {
  chats: {
    byId: {
      1: {
        title: "The First Penny Chat",
        description: "The first chat ever created",
        date: "2020-01-01 12:00:00.000",
        participants: [
          {
            user: 1,
            role: "Organizer"
          },
          {
            user: 2,
            role: "Invitee"
          }
        ],
        followUps: [1]
      },
      2: {
        title: "The Next Penny Chat",
        description: "This is another example",
        date: "2020-12-01 20:00:00.000",
        participants: [
          {
            user: 2,
            role: "Organizer"
          },
          {
            user: 1,
            role: "Attendee"
          }
        ],
        followUps: [2, 3]
      }
    },
    allIds: [1, 2]
  },
  followUps: {
    byId: {
      1: {
        content: "This was a great Penny Chat. I loved it!",
        date: "2020-01-01 15:00:00.000",
        participants: [
          {
            user: 1,
            role: "Organizer"
          },
          {
            user: 2,
            role: "Invitee"
          }
        ],
        followUps: [1]
      },
      2: {
        content: "We learned a lot. Trust me.",
        date: "2020-12-01 21:00:00.000",
        user: 2
      },
      3: {
        content: "I have nothing more to add.",
        date: "2020-12-01 21:30:00.000",
        user: 1
      }
    },
    allIds: [1, 2, 3]
  },
  users: {
    byId: {
      1: {
        real_name: "Nick Chouard"
      },
      2: {
        real_name: "John Berryman"
      }
    },
    allIds: [1, 2]
  }
}
```
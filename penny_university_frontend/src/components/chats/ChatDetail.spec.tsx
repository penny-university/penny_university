
import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import ChatDetail from './ChatDetail'
import { normalizedChat, normalizedFollowUps, users } from '../../tests/data'
import { User } from '../../models'
import { TestIDs } from '../follow-ups/FollowUpCard'

const followUps = Object.values(normalizedFollowUps)

beforeEach(() => {
  window.scrollTo = jest.fn()
});

test('users can only edit followups they created', () => {
  render(
    <ChatDetail
      chat={normalizedChat['1']}
      followUps={followUps}
      createFollowUp={jest.fn()}
      updateFollowUp={jest.fn()}
      user={users['1']}
      getUserByID={(id: string) => users[id]}
    />)

  const buttons = screen.getAllByTestId(TestIDs.subMenu)
  // There should be two followUps
  expect(followUps.length).toBe(2)
  // But only one of them is editable by the user
  expect(buttons.length).toBe(1)
})

test('users can only create follow ups when authenticated', () => {
  render(
    <ChatDetail
      chat={normalizedChat['1']}
      followUps={followUps}
      createFollowUp={jest.fn()}
      updateFollowUp={jest.fn()}
      user={users['1']}
      getUserByID={(id: string) => users[id]}
    />)

  const addNewButton = screen.getAllByText("Add New Follow Up")
  fireEvent.click(addNewButton[0])
  
  const markdownButton = screen.getByText("Save Follow Up")
  expect(markdownButton).toBeTruthy()

})

test('users can only create follow ups when authenticated', () => {
  render(
    <ChatDetail
      chat={normalizedChat['1']}
      followUps={followUps}
      createFollowUp={jest.fn()}
      updateFollowUp={jest.fn()}
      user={new User()}
      getUserByID={(id: string) => users[id]}
    />)

  const addNewButton = screen.getAllByText("Add New Follow Up")
  fireEvent.click(addNewButton[0])
  
  const markdownButton = screen.queryByText("Save Follow Up")
  expect(markdownButton).toBeNull()
})

import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import ProfilePage from '.'
import { authenticatedState, unauthenticatedState, MockAppState } from '../../tests/config'
import { Modal } from '../../components'
import { TestIDs } from '../../components/chats/ChatCard'

test('profile page shows list of users chats', () => {
  render(
    <MockAppState store={authenticatedState}>
      <ProfilePage match={{ params: { id: '1' } }} />
    </MockAppState>,
  )

  const chats = screen.getAllByTestId(TestIDs.chatCard)
  // AuthedUser has only two follups
  expect(chats.length).toBe(2)
})

test('profile page displays settings gear on authenticated user profile', () => {
  render(
    <MockAppState store={authenticatedState}>
      <ProfilePage match={{ params: { id: '1' } }} />
      <Modal />
    </MockAppState>,
  )

  const settingsButton = screen.getAllByText('Settings')
  fireEvent.click(settingsButton[0])

  const modalHeader = screen.getByText('Update Profile')
  expect(modalHeader).toBeTruthy()
})

test('profile page does not display settings gear on other user profile when authenticated', () => {
  render(
    <MockAppState store={authenticatedState}>
      <ProfilePage match={{ params: { id: '2' } }} />
    </MockAppState>,
  )

  const settingsButton = screen.queryByText('Settings')
  expect(settingsButton).toBeNull()
})

test('profile page does not display settings gear on unauthenticated user profile', () => {
  render(
    <MockAppState store={unauthenticatedState}>
      <ProfilePage match={{ params: { id: '2' } }} />
    </MockAppState>,
  )

  const settingsButton = screen.queryByText('Settings')
  expect(settingsButton).toBeNull()
})

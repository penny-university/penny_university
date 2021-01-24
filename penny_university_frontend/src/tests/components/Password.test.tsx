import React from 'react'
import { shallow, mount } from 'enzyme'
import { AuthPasswordModal } from '../../components/modal/auth/password'

describe('auth password modal', () => {
  it('renders correctly', () => {
    const email = 'test@gmail.com'
    const component = shallow(<AuthPasswordModal email={email} login={jest.fn()} requestPasswordReset={jest.fn()} />)
    expect(component).toMatchSnapshot()
  })

  it('should call requestPasswordReset upon clicking forgot password', () => {
    const email = 'test@gmail.com'
    const requestPasswordReset = jest.fn()
    const component = mount(
      <AuthPasswordModal email={email} login={jest.fn()} requestPasswordReset={requestPasswordReset} />,
    )
    const forgotPassword = component.find('#forgot-password').find('button')
    forgotPassword.simulate('click')
    expect(requestPasswordReset.mock.calls[0][0]).toEqual({ email: 'test@gmail.com' })
  })
})

import React from 'react'
import { shallow, mount } from 'enzyme'
import { Alert } from 'reactstrap'
import { ErrorAlert } from '../../components/alerts/index.tsx'

describe('error alert component', () => {
  it('renders correctly', () => {
    const error = { error: 'error' }
    const component = shallow(<ErrorAlert error={error} dismiss={jest.fn()} />)
    expect(component).toMatchSnapshot()
  })

  it('should display with error message', () => {
    const error = { error: 'error' }
    const component = mount(<ErrorAlert error={error} dismiss={jest.fn()} />)
    expect(component.find(Alert).text()).toContain('error')
  })

  it('should not display without an error message', () => {
    const component = shallow(<ErrorAlert error={undefined} dismiss={jest.fn()} />)
    expect(component.find(Alert)).toEqual({})
  })

  it('should be dismissed', () => {
    const error = { error: 'error' }
    const component = mount(<ErrorAlert error={error} dismiss={jest.fn()} />)
    component
      .find('button.close')
      .at(0)
      .simulate('click')

    expect(component.find(Alert)).toEqual({})
  })
})

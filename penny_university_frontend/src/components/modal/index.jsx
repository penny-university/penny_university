// @flow
/* eslint-disable max-lines-per-function */

import React, { useReducer, useEffect } from 'react'
import { Modal as ModalStrap } from 'reactstrap'
import modalDispatch from './dispatch'
import Actions, { ModalNames } from './constants'
import { AuthEmail, AuthPassword, AuthSignup } from './auth'

const initialState = {
  name: null,
  open: false,
};

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case Actions.CLOSE_MODAL:
      return { open: false, name: null, props: {} }
    case Actions.OPEN_MODAL:
      return { open: true, name: payload.name, props: payload.props }
    default:
      return state
  }
}

const Modals = {
  [ModalNames.AUTH_EMAIL]: AuthEmail,
  [ModalNames.AUTH_PASSWORD]: AuthPassword,
  [ModalNames.AUTH_SIGNUP]: AuthSignup,
}

export const Modal = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    modalDispatch.mount(dispatch)
    return modalDispatch.unmount
  })
  const { open, props, name } = state
  const Content = Modals[name]
  return (
    <ModalStrap isOpen={open} toggle={modalDispatch.close}>
      { Content ? <Content {...props} /> : null }
    </ModalStrap>
  )
}

export default Modal

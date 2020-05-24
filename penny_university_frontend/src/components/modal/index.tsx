// @flow
/* eslint-disable max-lines-per-function */

import React, { useReducer, useEffect } from 'react'
import { Modal as ModalStrap } from 'reactstrap'
import modalDispatch from './dispatch'
import Actions, { ModalNames } from './constants'
import { AuthEmail, AuthPassword, AuthSignup } from './auth'


type State = { name: string | null, open: boolean, props: { email?: string | undefined } }

export type Action = { type: string, payload: { open: boolean, name: string, props?: { email?: string } } }

const initialState = {
  name: null,
  open: false,
};

function reducer(state: State, action: Action): State {
  const { type, payload } = action
  switch (type) {
    case Actions.CLOSE_MODAL:
      return { open: false, name: null, props: {} }
    case Actions.OPEN_MODAL:
      return { open: true, name: payload.name, props: payload.props || {} }
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
  // @ts-ignore
  const [state, dispatch] = useReducer<State, Action>(reducer, initialState, (initSate: State) => initSate);
  useEffect(() => {
    modalDispatch.mount(dispatch)
    return modalDispatch.unmount
  })
  const { open, props, name } = state
  const Content = name ? Modals[name] : null
  return (
    <ModalStrap isOpen={open} toggle={modalDispatch.close}>
      {Content ? <Content {...props} /> : null}
    </ModalStrap>
  )
}

export default Modal

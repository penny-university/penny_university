import { Dispatch } from 'react'
import { Action } from '.'
import Actions, { ModalNames } from './constants'

const modalDispatch = () => {
  let _dispatch: Dispatch<Action> | null = null // eslint-disable-line no-underscore-dangle
  const mount = (dispatch: Dispatch<Action>) => {
    _dispatch = dispatch
  }

  const unmount = () => {
    _dispatch = null
  }

  const call = (func: Function) => (...args: any) => {
    if (_dispatch) {
      _dispatch(func(...args))
    }
  }

  const authUsername = () => ({
    type: Actions.OPEN_MODAL,
    payload: {
      name: ModalNames.AUTH_EMAIL,
    },
  })

  const authPassword = (email: string) => ({
    type: Actions.OPEN_MODAL,
    payload: {
      name: ModalNames.AUTH_PASSWORD,
      props: { email },
    },
  })

  const authSignup = (email: string) => ({
    type: Actions.OPEN_MODAL,
    payload: {
      name: ModalNames.AUTH_SIGNUP,
      props: { email },
    },
  })

  const deleteModal = (props: { warning: string, confirmOnPress: () => void}) => ({
    type: Actions.OPEN_MODAL,
    payload: {
      name: ModalNames.CONFIRM_DELETE,
      props,
    }
  })

  const close = () => ({
    type: Actions.CLOSE_MODAL,
    payload: null,
  })

  return {
    mount,
    unmount,
    auth: call(authUsername),
    authSignup: call(authSignup),
    authPassword: call(authPassword),
    delete: call(deleteModal),
    close: call(close),
  }
}

export default modalDispatch()

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

  const open = (payload: Object) => ({
    type: Actions.OPEN_MODAL,
    payload,
  })

  const close = () => ({
    type: Actions.CLOSE_MODAL,
    payload: null,
  })

  const authUsername = () => open({
    name: ModalNames.AUTH_EMAIL,
  })

  const authPassword = (email: string) => open({
    name: ModalNames.AUTH_PASSWORD,
    props: { email },
  })

  const authSignup = (email: string) => open({
    name: ModalNames.AUTH_SIGNUP,
    props: { email },
  })

  const verifyEmail = (email: string) => open({
    name: ModalNames.VERIFY_EMAIL,
    props: { email },
  })

  return {
    mount,
    unmount,
    auth: call(authUsername),
    authSignup: call(authSignup),
    authPassword: call(authPassword),
    verifyEmail: call(verifyEmail),
    close: call(close),
  }
}

export default modalDispatch()

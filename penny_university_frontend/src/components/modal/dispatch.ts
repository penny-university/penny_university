import { Dispatch } from 'react'
import { Action } from '.'
import Actions, { ModalNames } from './constants'
import { User } from '../../models'

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

  const open = call((payload: {name: string, props: Object}) => ({
    type: Actions.OPEN_MODAL,
    payload,
  }))

  const close = call(() => ({
    type: Actions.CLOSE_MODAL,
    payload: null,
  }))

  const auth = (followUp?: { chatId: number, content: string } | undefined) => open({
    name: ModalNames.AUTH_EMAIL,
    props: { followUp },
  })

  const settings = (user: User) => open({
    name: ModalNames.SETTINGS,
    props: { user },
  })

  const authPassword = (email: string, followUp: { chatId: number, content: string } | undefined) => open({
    name: ModalNames.AUTH_PASSWORD,
    props: { email, followUp },
  })

  const authPasswordReset = (email: string) => open({
    name: ModalNames.AUTH_PASSWORD_RESET,
    props: { email },
  })

  const authSignup = (email: string, followUp: { chatId: number, content: string } | undefined) => open({
    name: ModalNames.AUTH_SIGNUP,
    props: { email, followUp },
  })

  const verifyEmail = (email: string, followUp?: { chatId: number, content: string } | undefined | boolean) => open({
    name: ModalNames.VERIFY_EMAIL,
    props: { email, followUp },
  })

  return {
    mount,
    unmount,
    auth,
    authSignup,
    authPassword,
    authPasswordReset,
    settings,
    verifyEmail,
    close,
  }
}

export default modalDispatch()

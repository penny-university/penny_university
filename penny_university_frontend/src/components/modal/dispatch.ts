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

  const open = call((payload: Object) => ({
    type: Actions.OPEN_MODAL,
    payload,
  }))

  const close = call(() => ({
    type: Actions.CLOSE_MODAL,
    payload: null,
  }))

  const authUsername = () => open({
    name: ModalNames.AUTH_EMAIL,
  })

  const settings = (user: User) => open({
    name: ModalNames.SETTINGS,
    props: { user },
  })

  const authPassword = (email: string) => open({
    name: ModalNames.AUTH_PASSWORD,
    props: { email },
  })

  const authPasswordReset = (email: string) => open({
    name: ModalNames.AUTH_PASSWORD_RESET,
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

  const confirmDeleteFollowUp = (followUpID: number, chatID: number) => open({
    name: ModalNames.CONFIRM_DELETE_FOLLOW_UP,
    props: { followUpID, chatID },
  })

  return {
    mount,
    unmount,
    auth: authUsername,
    authSignup,
    authPassword,
    authPasswordReset,
    settings,
    verifyEmail,
    confirmDeleteFollowUp,
    close,
  }
}

export default modalDispatch()

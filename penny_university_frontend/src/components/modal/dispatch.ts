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

  const auth = (followUpText?: string | undefined) => open({
    name: ModalNames.AUTH_EMAIL,
    props: { followUpText },
  })

  const settings = (user: User) => open({
    name: ModalNames.SETTINGS,
    props: { user },
  })

  const authPassword = (email: string, followUpText: string | undefined) => open({
    name: ModalNames.AUTH_PASSWORD,
    props: { email, followUpText },
  })

  const authSignup = (email: string, followUpText: string | undefined) => open({
    name: ModalNames.AUTH_SIGNUP,
    props: { email, followUpText },
  })

  const verifyEmail = (email: string, followUpText?: string | undefined | boolean) => open({
    name: ModalNames.VERIFY_EMAIL,
    props: { email, followUpText },
  })

  return {
    mount,
    unmount,
    auth,
    authSignup,
    authPassword,
    settings,
    verifyEmail,
    close,
  }
}

export default modalDispatch()

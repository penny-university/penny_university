import Actions, { ModalNames } from './constants'

const modalDispatch = () => {
  let _dispatch = null // eslint-disable-line no-underscore-dangle
  const mount = (dispatch) => {
    _dispatch = dispatch
  }

  const unmount = () => {
    _dispatch = null
  }

  const call = (func) => (...args) => {
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

  const authPassword = (email) => ({
    type: Actions.OPEN_MODAL,
    payload: {
      name: ModalNames.AUTH_PASSWORD,
      props: { email },
    },
  })

  const authSignup = (email) => ({
    type: Actions.OPEN_MODAL,
    payload: {
      name: ModalNames.AUTH_SIGNUP,
      props: { email },
    },
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
    close: call(close),
  }
}

export default modalDispatch()

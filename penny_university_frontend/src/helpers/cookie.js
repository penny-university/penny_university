// @flow
const Cookies = {
  token: 'token',
  user: 'user',
}

const AUTH_EXPIRATION = 60 * 24 * 7 * 4 // 4 weeks

const CookieHelper = () => {
  const getCookie = (name) => {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) { // eslint-disable-line no-plusplus
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const setCookie = (name, data, expiration) => {
    let expires = ''
    if (expiration) {
      const date = new Date()
      date.setTime(date.getTime() + expiration * 60 * 1000)
      expires = `; expires=${date.toUTCString()}`
    }
    document.cookie = `${name}=${data || ''}${expires}; path=/`
  }

  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`
  }

  const setToken = (data) => setCookie(Cookies.token, data, AUTH_EXPIRATION)
  const getToken = () => getCookie(Cookies.token)
  const deleteToken = () => deleteCookie(Cookies.token)

  const setUser = (data) => setCookie(Cookies.user, data, AUTH_EXPIRATION)
  const getUser = () => getCookie(Cookies.user)
  const deleteUser = () => deleteCookie(Cookies.user)

  const clearCookies = () => {
    deleteUser()
    deleteToken()
  }

  return {
    setToken,
    getToken,
    deleteToken,
    setUser,
    getUser,
    deleteUser,
    clearCookies,
  }
}
export default CookieHelper()


const logging = (store) => (next) => (action) => {
  const before = store.getState()
  const result = next(action)
  if (process.env.NODE_ENV !== 'production') {
    // Group these console logs into one closed group
    /* eslint-disable no-console */
    const after = store.getState()
    console.groupCollapsed(`dispatching action => ${action.type}`)
    console.log('BEFORE', before)
    console.log('ACTION', action.type, action)
    console.log('AFTER', after)
    console.groupEnd()
    /* eslint-enable no-console */
  }

  return result
}

export default logging

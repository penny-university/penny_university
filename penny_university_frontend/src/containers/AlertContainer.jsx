import React from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { CLEAR_ERROR_MESSAGE } from '../actions'
import { ErrorAlert } from '../components/alerts'

const AlertContainer = ({ error, dismissError }) => (
  <div className="alert-container">
    <ErrorAlert message={error} dismiss={dismissError} />
  </div>
)

const mapStateToProps = (state) => {
  const { error } = state
  return { error: error?.message }
}

const mapDispatchToProps = (dispatch) => ({
  dismissError: () => dispatch({ type: CLEAR_ERROR_MESSAGE }),
})

AlertContainer.propTypes = {
  error: propTypes.string.isRequired,
  dismissError: propTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer)

import React from 'react'
import { connect } from 'react-redux'
import { CLEAR_ERROR_MESSAGE } from '../actions'
import { ErrorAlert } from '../components/alerts'

const AlertContainer = ({ error, dismissError }) => (
  <div className="alert-container">
    <ErrorAlert message={error} dismiss={dismissError} />
  </div>
)

const mapStateToProps = (state) => {
  const { error } = state
  return { error }
}

const mapDispatchToProps = (dispatch) => ({
  dismissError: () => dispatch({ type: CLEAR_ERROR_MESSAGE }),
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer)

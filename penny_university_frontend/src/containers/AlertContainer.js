import React from 'react'
import {CLEAR_ERROR_MESSAGE} from '../actions'
import {connect} from 'react-redux'
import {ErrorAlert} from '../components/alerts'

const AlertContainer = ({error, dismissError}) => (
  <div class="alert-container">
    <ErrorAlert message={error} dismiss={dismissError}/>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  const {error} = state
  return {error}
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissError: () => dispatch({type: CLEAR_ERROR_MESSAGE})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer)

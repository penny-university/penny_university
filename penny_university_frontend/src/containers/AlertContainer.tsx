import React from 'react'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { CLEAR_ERROR_MESSAGE } from '../actions'
import { ErrorAlert } from '../components/alerts'
import{ RootState } from '../reducers'

type AlertContainerProps = {
  error: string, 
  dismissError: () => void,
}

const AlertContainer = ({ error, dismissError }: AlertContainerProps) => (
  <div className="alert-container">
    <ErrorAlert message={error} dismiss={dismissError} />
  </div>
)

const mapStateToProps = (state: RootState) => {
  const { error } = state
  return { error: error?.message }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  dismissError: () => dispatch({ type: CLEAR_ERROR_MESSAGE }),
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer)

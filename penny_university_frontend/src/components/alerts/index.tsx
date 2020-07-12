import React from 'react'
import { Alert } from 'reactstrap'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { ChatActions } from '../../actions'
import { RootState } from '../../reducers'

require('./style.scss')

type AlertProps = {
  error: Object | undefined,
  dismiss: () => void,
}

export const ErrorAlert = ({ error, dismiss }: AlertProps) => {
  const onDismiss = () => {
    dismiss()
  }

  return error ? (
    <div className="alert-container">
      <Alert color="danger" isOpen toggle={onDismiss}>
        {Object.values(error).flat().map((v, i) => <p key={`ErrorMessage-${v}`} className="mb-0">{v}</p>)}
      </Alert>
    </div>
  ) : null
}

const mapStateToProps = (state: RootState) => ({
  error: state?.error?.body,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  dismiss: () => dispatch({ type: ChatActions.CLEAR_ERROR_MESSAGE }),
})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorAlert)

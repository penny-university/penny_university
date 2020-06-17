import React, { useState } from 'react'
import { Alert } from 'reactstrap'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { ChatActions } from '../../actions/index.ts'
import { RootState } from '../../reducers/index.ts'


type AlertProps = {
  error: string,
  dismiss: () => void,
}

export const ErrorAlert = ({ error, dismiss }: AlertProps) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => {
    setVisible(false)
    dismiss()
  }

  return error ? (
    <div className="alert-container">
      <Alert color="danger" isOpen={visible} toggle={onDismiss}>
        {error}
      </Alert>
    </div>
  ) : null
}


const mapStateToProps = (state: RootState) => {
  const { error } = state
  return { error: error?.message }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  dismiss: () => dispatch({ type: ChatActions.CLEAR_ERROR_MESSAGE }),
})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorAlert)

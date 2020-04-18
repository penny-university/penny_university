import React, { useState } from 'react'
import { Alert } from 'reactstrap'
import propTypes from 'prop-types'

const ErrorAlert = ({ message, dismiss }) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => {
    setVisible(false)
    dismiss()
  }

  return message ? (
    <Alert color="danger" isOpen={visible} toggle={onDismiss}>
      {message}
    </Alert>
  ) : null
}

ErrorAlert.propTypes = {
  message: propTypes.string.isRequired,
  dismiss: propTypes.func.isRequired,
}

export default ErrorAlert

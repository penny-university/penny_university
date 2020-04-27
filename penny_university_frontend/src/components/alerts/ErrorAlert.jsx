import React, { useState } from 'react'
import { Alert } from 'reactstrap'
import PropTypes from 'prop-types'

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
  message: PropTypes.string,
  dismiss: PropTypes.func.isRequired,
}

export default ErrorAlert

import React, { useState } from 'react'
import { Alert } from 'reactstrap'

const ErrorAlert = ({ message, dismiss }: { message: string | null, dismiss: () => void }) => {
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

export default ErrorAlert

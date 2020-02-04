import React, {useState} from 'react'
import {Alert} from 'reactstrap'

const AlertExample = ({message, dismiss}) => {
  const [visible, setVisible] = useState(true)

  const onDismiss = () => {
    setVisible(false)
    dismiss()
  }

  return (
    <Alert color="danger" isOpen={visible} toggle={onDismiss}>
      {message}
    </Alert>
  )
}

export default AlertExample
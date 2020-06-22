import React from 'react'
import {
  ModalHeader, ModalBody,
} from 'reactstrap'
import modalDispatch from '../dispatch'

type AuthPasswordResetModalProps = {
  email: string
}

const AuthPasswordResetModal = ({ email }: AuthPasswordResetModalProps) => {
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Reset Password</ModalHeader>
      <ModalBody>
        Password reset request sent to {email}!
      </ModalBody>
    </>
  )
}


export default AuthPasswordResetModal

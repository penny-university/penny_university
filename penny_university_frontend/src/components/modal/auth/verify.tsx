// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  ModalHeader, ModalBody, Button,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import { resendVerifyEmail } from '../../../actions/user'

type AuthEmailModalProps = {
  email: string,
  resendVerifyEmail: (email: string) => AnyAction
}

const AuthEmailModal = ({ email, resendVerifyEmail }: AuthEmailModalProps) => {
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
          <div className="text-center">
            <p>{email} needs to be verified</p>
            <Button onClick={() => resendVerifyEmail(email)}>
              Resend Verification email
            </Button>
          </div>
      </ModalBody>
    </>
  )
}


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  resendVerifyEmail: (email: string) => dispatch(resendVerifyEmail(email)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AuthEmailModal)

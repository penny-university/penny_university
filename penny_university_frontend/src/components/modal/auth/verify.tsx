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

type VerifyModalProps = {
  email: string,
  resendVerifyEmail: (email: string, followUpText: string | undefined) => AnyAction,
  followUpText: string | undefined | boolean
}

const VerifyModal = ({ email, resendVerifyEmail, followUpText }: VerifyModalProps) => {
  let savedFollowUpNotice = null
  let toSaveFollowUp: string | undefined = undefined
  if (typeof followUpText === 'string') {
    savedFollowUpNotice = <p>Resend the verification email and we'll save the follow up for when you verify!</p>
    toSaveFollowUp = followUpText
  } else if (followUpText) {
    savedFollowUpNotice = <p>We saved your follow up! Verify your email to view it!</p>
  }
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <p>{email} needs to be verified.</p>
          <p>Check your email for a verification link.</p>
          {savedFollowUpNotice}
          <Button onClick={() => resendVerifyEmail(email, toSaveFollowUp)}>
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
  resendVerifyEmail: (email: string, followUpText: string | undefined) => dispatch(resendVerifyEmail(email, followUpText)),
})
export default connect(mapStateToProps, mapDispatchToProps)(VerifyModal)

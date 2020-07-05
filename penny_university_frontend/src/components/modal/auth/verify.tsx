// @flow

import React from 'react'
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
  resendVerifyEmail: (email: string, followUp: { chatId: number, content: string } | undefined) => AnyAction,
  followUp: { chatId: number, content: string } | undefined | boolean
}

const VerifyModal = ({ email, resendVerifyEmail, followUp }: VerifyModalProps) => {
  let savedFollowUpNotice = null
  let toSaveFollowUp: { chatId: number, content: string } | undefined
  if (typeof followUp === 'object') {
    savedFollowUpNotice = <p>Resend the verification email and we&apos;ll save the follow up for when you verify!</p>
    toSaveFollowUp = followUp
  } else if (followUp) {
    savedFollowUpNotice = <p>We saved your follow up! Verify your email to view it!</p>
  }
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <p>
            {email}
            {' '}
            needs to be verified.
          </p>
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
  resendVerifyEmail:
    (email: string, followUp:
      { chatId: number, content: string } | undefined) => dispatch(resendVerifyEmail(email, followUp)),
})
export default connect(mapStateToProps, mapDispatchToProps)(VerifyModal)

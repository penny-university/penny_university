// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import { Input } from '../../fields'
import modalDispatch from '../dispatch'
import { userExists } from '../../../actions/user'

type AuthEmailModalProps = {
  userExists: (email: string, followUpText: string | undefined) => AnyAction
  followUpText?: string | undefined,
}

const AuthEmailModal = ({ userExists, followUpText }: AuthEmailModalProps) => {
  const [email, setEmail] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          userExists(email, followUpText)
          return false
        }}
        >
          <Input label="Email" type="email" name="email" id="email" placeholder="" required onChange={setEmail} value={email} />
          <div className="text-center">
            <Button>
              Let&rsquo;s Go
            </Button>
          </div>
        </Form>
      </ModalBody>
    </>
  )
}

AuthEmailModal.defaultProps = {
  followUpText: undefined,
}


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  userExists: (email: string, followUpText: string | undefined) => dispatch(userExists(email, followUpText)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AuthEmailModal)

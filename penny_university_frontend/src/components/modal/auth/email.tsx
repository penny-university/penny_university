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
  userExists: (email: string, followUp: { chatId: number, content: string } | undefined) => AnyAction
  followUp?: { chatId: number, content: string } | undefined,
}

const AuthEmailModal = ({ userExists, followUp }: AuthEmailModalProps) => {
  const [email, setEmail] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          userExists(email, followUp)
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
  followUp: undefined,
}


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  userExists: (email: string, followUp: { chatId: number, content: string } | undefined) => dispatch(userExists(email, followUp)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AuthEmailModal)

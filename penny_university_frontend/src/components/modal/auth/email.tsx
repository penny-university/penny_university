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
  userExists: (email: string) => AnyAction
}

const AuthEmailModal = ({ userExists }: AuthEmailModalProps) => {
  const [email, setEmail] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          userExists(email)
          return false
        }}
        >
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder=""
            required
            onChange={setEmail}
            value={email}
          />
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

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => ({
  userExists: (email: string) => dispatch(userExists(email)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AuthEmailModal)

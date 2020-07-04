// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  Form, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import { dispatchLogin, requestPasswordReset } from '../../../actions/user'
import { Input } from '../../fields'

type AuthPasswordModalProps = {
  email: string,
  followUp?: { chatId: number, content: string }  | undefined,
  login: (payload: {email: string, password: string, followUp: { chatId: number, content: string } | undefined }) => void,
  requestPasswordReset: (payload: {email: string}) => void,
}

const AuthPasswordModal = ({ email, login, followUp, requestPasswordReset }: AuthPasswordModalProps) => {
  const [password, setPassword] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Welcome back!</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          login({ email, password, followUp })
        }}
        >
          <Input label="Password" type="password" name="password" id="password" placeholder="" onChange={setPassword} value={password} required />
          <div className="text-center">
            <Button>Let&rsquo;s Go</Button>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="link" onClick={() => {requestPasswordReset({ email })}}>Forgot password?</Button>
      </ModalFooter>
    </>
  )
}

AuthPasswordModal.defaultProps = {
  followUp: undefined,
}


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  login: (payload: {email: string, password: string, followUp: { chatId: number, content: string } | undefined }) => dispatch(dispatchLogin(payload)),
  requestPasswordReset: (payload: {email: string}) => dispatch(requestPasswordReset(payload)),
})


export default connect(mapStateToProps, mapDispatchToProps)(AuthPasswordModal)

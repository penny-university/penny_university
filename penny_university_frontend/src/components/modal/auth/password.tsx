// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import { dispatchLogin } from '../../../actions/user'
import { Input } from '../../fields'

type AuthPasswordModalProps = {
  email: string,
  followUp?: { chatId: number, content: string }  | undefined,
  login: (payload: {email: string, password: string, followUp: { chatId: number, content: string } | undefined }) => void,
}

const AuthPasswordModal = ({ email, login, followUp }: AuthPasswordModalProps) => {
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
})


export default connect(mapStateToProps, mapDispatchToProps)(AuthPasswordModal)

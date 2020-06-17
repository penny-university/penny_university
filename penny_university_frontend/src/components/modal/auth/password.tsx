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
  followUpText?: string | undefined,
  login: (payload: {email: string, password: string, followUpText: string | undefined }) => void,
}

const AuthPasswordModal = ({ email, login, followUpText }: AuthPasswordModalProps) => {
  const [password, setPassword] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Welcome back!</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          login({ email, password, followUpText })
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
  followUpText: undefined,
}


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  login: (payload: {email: string, password: string, followUpText: string | undefined }) => dispatch(dispatchLogin(payload)),
})


export default connect(mapStateToProps, mapDispatchToProps)(AuthPasswordModal)

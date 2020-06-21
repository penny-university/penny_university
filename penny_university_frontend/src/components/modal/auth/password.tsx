// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import modalDispatch from '../dispatch.ts'
import { dispatchLogin } from '../../../actions/user.ts'
import { Input } from '../../fields/index.ts'

type AuthPasswordModalProps = {
  email: string,
  login: (payload: { email: string, password: string }) => void,
}

const AuthPasswordModal = ({ email, login }: AuthPasswordModalProps) => {
  const [password, setPassword] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Welcome back!</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          login({ email, password })
        }}
        >
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder=""
            onChange={setPassword}
            value={password}
            required
          />
          <div className="text-center">
            <Button>Let&rsquo;s Go</Button>
          </div>
        </Form>
      </ModalBody>
    </>
  )
}

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  login: (payload: { email: string, password: string }) => dispatch(dispatchLogin(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthPasswordModal)

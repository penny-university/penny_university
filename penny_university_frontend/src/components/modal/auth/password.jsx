// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import propTypes from 'prop-types'
import modalDispatch from '../dispatch'
import { dispatchLogin } from '../../../actions/user'
import { Input } from '../../fields'

const AuthPasswordModal = ({ email, login }) => {
  const [password, setPassword] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          login({ email, password })
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


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(dispatchLogin(payload)),
})

AuthPasswordModal.propTypes = {
  login: propTypes.bool.isRequired,
  email: propTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPasswordModal)

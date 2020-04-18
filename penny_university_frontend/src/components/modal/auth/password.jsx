// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Form, FormGroup, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import propTypes from 'prop-types'
import modalDispatch from '../dispatch'
import { dispatchLogin } from '../../../actions/user'
import { Input } from '../../fields'

const AuthPasswordModal = ({ username, login }) => {
  const [password, setPassword] = useState('');
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Input label="Password" type="password" name="password" id="password" placeholder="" onChange={setPassword} value={password} />
          </FormGroup>
          <div className="text-center">
            <Button onClick={() => login({ username, password })}>Let&rsquo;s Go</Button>
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
  username: propTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPasswordModal)

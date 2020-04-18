// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Form, FormGroup, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import propTypes from 'prop-types'
import modalDispatch from '../dispatch'
import { dispatchSignup } from '../../../actions/user'
import { Input } from '../../fields'


const AuthSignupModal = ({ signup, username }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Input label="First Name" type="text" name="firstName" id="firstName" placeholder="" onChange={setFirstName} value={firstName} />
            <Input label="Last Name" type="text" name="lastName" id="lastName" placeholder="" onChange={setLastName} value={lastName} />
            <Input label="Email" type="email" name="email" id="email" placeholder="" onChange={setEmail} value={email} />
            <Input label="Password" type="password" name="password" id="password" placeholder="" onChange={setPassword} value={password} />
          </FormGroup>
          <div className="text-center">
            <Button onClick={() => signup({
              username, password, firstName, lastName, email,
            })}
            >
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

const mapDispatchToProps = (dispatch) => ({
  signup: (payload) => dispatch(dispatchSignup(payload)),
})

AuthSignupModal.propTypes = {
  signup: propTypes.bool.isRequired,
  username: propTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthSignupModal)

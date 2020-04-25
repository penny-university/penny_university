// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import propTypes from 'prop-types'
import modalDispatch from '../dispatch'
import { dispatchSignup } from '../../../actions/user'
import { Input } from '../../fields'


const AuthSignupModal = ({ signup, email: orignalEmail }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState(orignalEmail)
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Looks like you're new. Fill out this form to create an account.</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          signup({
            password, firstName, lastName, email,
          })
        }}
        >
          <Input label="First Name" type="text" name="firstName" id="firstName" placeholder="" onChange={setFirstName} value={firstName} required />
          <Input label="Last Name" type="text" name="lastName" id="lastName" placeholder="" onChange={setLastName} value={lastName} required />
          <Input label="Email" type="email" name="email" id="email" placeholder="" onChange={setEmail} value={email} helperText={"If you are part of the Penny U Slack, use the same email as that slack account."} />
          <Input label="Password" type="password" name="password" id="password" placeholder="" onChange={setPassword} value={password} required />
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

const mapDispatchToProps = (dispatch) => ({
  signup: (payload) => dispatch(dispatchSignup(payload)),
})

AuthSignupModal.propTypes = {
  signup: propTypes.bool.isRequired,
  email: propTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthSignupModal)

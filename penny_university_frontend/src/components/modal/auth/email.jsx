// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import propTypes from 'prop-types'
import { Input } from '../../fields'
import modalDispatch from '../dispatch'
import { dispatchUserExists } from '../../../actions/user'

const AuthEmailModal = ({ userExists }) => {
  const [email, setEmail] = useState('')
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          userExists(email).then((action) => {
            if (action.payload?.status === 400) {
              modalDispatch.authSignup(email)
            } else {
              modalDispatch.authPassword(email)
            }
          })
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


const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch) => ({
  userExists: (email) => dispatch(dispatchUserExists(email)),
})
AuthEmailModal.propTypes = {
  userExists: propTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthEmailModal)

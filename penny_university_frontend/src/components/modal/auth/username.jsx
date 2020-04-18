// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Form, FormGroup, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import propTypes from 'prop-types'
import { Input } from '../../fields'
import modalDispatch from '../dispatch'
import { dispatchUserExists } from '../../../actions/user'

const AuthUsernameModal = ({ userExists }) => {
  const [username, setUsername] = useState('');
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Sign up or log in</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Input label="Username" type="tezt" name="username" id="username" placeholder="" onChange={setUsername} value={username} />
          </FormGroup>
          <div className="text-center">
            <Button onClick={() => userExists(username).then((action) => {
              if (action.payload?.status === 400) {
                modalDispatch.authSignup(username)
              } else {
                modalDispatch.authPassword(username)
              }
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
  userExists: (username) => dispatch(dispatchUserExists(username)),
})
AuthUsernameModal.propTypes = {
  userExists: propTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthUsernameModal)

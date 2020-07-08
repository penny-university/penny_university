// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  Form, ModalHeader, ModalBody, Button,
} from 'reactstrap'
import modalDispatch from '../dispatch'
import { updateUser } from '../../../actions/user'
import { Input } from '../../fields'
import { User } from '../../../models'

type SettingsModalProps = {
  update: (payload: {
    firstName: string,
    lastName: string,
  }, id: string) => void,
  user: User,
}

const SettingsModal = ({ update, user }: SettingsModalProps) => {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  return (
    <>
      <ModalHeader toggle={modalDispatch.close}>Update Profile</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => {
          e.preventDefault()
          update({
            firstName, lastName,
          }, user.id.toString())
          modalDispatch.close()
        }}
        >
          <Input
            label="First Name"
            type="text"
            name="firstName"
            id="firstName"
            placeholder=""
            onChange={setFirstName}
            value={firstName}
            required
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            id="lastName"
            placeholder=""
            onChange={setLastName}
            value={lastName}
            required
          />
          <div className="text-center">
            <Button>
              Update
            </Button>
          </div>
        </Form>
      </ModalBody>
    </>
  )
}

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  update: (payload: {
    firstName: string,
    lastName: string,
  }, id: string) => dispatch(updateUser(payload, id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)

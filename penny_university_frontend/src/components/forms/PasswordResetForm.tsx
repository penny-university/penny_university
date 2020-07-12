import React, { useState } from 'react'
import { Button, Form } from 'reactstrap';
import { Input } from '../fields';

type PasswordResetFormProps = {
  uid: string,
  token: string,
  resetPassword: (payload: { uid: string, token: string, newPassword1: string, newPassword2: string }) => void,
}

const PasswordResetForm = ({ uid, token, resetPassword }: PasswordResetFormProps) => {
  const [newPassword1, setNewPassword1] = useState('')
  const [newPassword2, setNewPassword2] = useState('')

  return (
    <Form onSubmit={(e) => {
      e.preventDefault()
      resetPassword({
        uid, token, newPassword1, newPassword2,
      })
    }}
    >
      <Input
        label="New Password"
        type="password"
        name="password"
        id="password"
        placeholder=""
        onChange={setNewPassword1}
        value={newPassword1}
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder=""
        onChange={setNewPassword2}
        value={newPassword2}
        required
      />
      <div className="text-center">
        <Button>Reset Password</Button>
      </div>
    </Form>
  )
}

export default PasswordResetForm

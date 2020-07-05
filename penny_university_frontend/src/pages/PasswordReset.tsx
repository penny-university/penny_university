import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
import queryString from 'query-string'
import { Button, Card, CardBody } from 'reactstrap';
import { RootState } from '../reducers/index.ts'
import { resetPassword } from '../actions/user.ts'
import { PasswordResetForm } from '../components/forms/index.ts'
import modalDispatch from '../components/modal/dispatch.ts'
import * as selectors from '../selectors/index.ts';
import { UserType } from '../models/user.ts';

type StateProps = {
  user: UserType,
  error: string | null,
}

type DispatchProps = {
  resetPassword: (payload: { uid: string, token: string, newPassword1: string, newPassword2: string }) => void,
}

type PasswordResetPageProps = StateProps & DispatchProps & RouteComponentProps<{}>

const PasswordResetPage = ({
  user, resetPassword, location, error,
}: PasswordResetPageProps) => {
  const parsed = queryString.parse(location.search);

  if (typeof parsed?.uid === 'string' && typeof parsed?.token === 'string') {
    return (
      <Card>
        <CardBody>
          <h1 className="text-center">Reset Your Password</h1>
          <PasswordResetForm uid={parsed?.uid} token={parsed?.token} resetPassword={resetPassword} />
        </CardBody>
      </Card>
    )
  } if (parsed?.status === 'success') {
    return user.id ? (<Redirect to="/chats" />) : (
      <Card>
        <CardBody>
          <h1 className="text-center">Your password was reset successfully!</h1>
          <div className="text-center">
            <Button onClick={() => modalDispatch.auth()}>Log In</Button>
          </div>
        </CardBody>
      </Card>
    )
  }
  return null
}

const mapStateToProps = (state: RootState) => {
  const { error } = state
  return {
    error: error?.body,
    user: selectors.user.getUser(state),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => ({
  resetPassword:
    (payload:
      { uid: string, token: string, newPassword1: string, newPassword2: string }) => dispatch(resetPassword(payload)),
})

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage)

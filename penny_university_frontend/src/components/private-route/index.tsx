// @flow

import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import * as selectors from '../../selectors'
import { User } from '../../models'
import { Routes } from '../../constants'
import { RootState } from '../../reducers'
import { CookieHelper } from '../../helpers'

type StateToPropsType = {
  user: User,
}

type PrivateRouteProps = StateToPropsType & {
  component: FunctionComponent<any>,
  exact?: boolean,
  path: string,
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const {
    component, user, path, exact,
  } = props
  const token = CookieHelper.getToken()
  if (user.valid || token) {
    return <Route exact={exact} path={path} component={component} />
  }
  return <Redirect to={Routes.Home} />
}

const mapStateToProps = (state: RootState): StateToPropsType => ({
  user: selectors.user.getUser(state),
})
// @ts-ignore
export default connect(mapStateToProps)(PrivateRoute)

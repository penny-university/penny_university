import React from 'react'
import {
  Button,
  Navbar,
  NavbarBrand,
} from 'reactstrap'
import propTypes from 'prop-types'
import modalDispatch from '../modal/dispatch'

const Navigation = ({ authed, logout }) => (
  <Navbar className="h2 bg-white shadow-sm" light sticky="top">
    <NavbarBrand href="/">Penny University</NavbarBrand>
    {authed ? (
      <Button
        outline
        onClick={logout}
      >
        Logout
      </Button>
    )
      : (
        <Button outline onClick={modalDispatch.auth}>Login</Button>
      )}
  </Navbar>
)

Navigation.propTypes = {
  authed: propTypes.bool.isRequired,
  logout: propTypes.func.isRequired,
}

export default Navigation

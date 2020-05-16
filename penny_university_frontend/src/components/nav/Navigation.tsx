import React from 'react'
import {
  Button,
  Navbar,
  NavbarBrand,
} from 'reactstrap'
import modalDispatch from '../modal/dispatch'

const Navigation = ({ authed, logout }: {authed: boolean, logout: () => void}) => (
  <Navbar className="h2 bg-white shadow-sm" light sticky="top">
    <NavbarBrand href="/">Penny University</NavbarBrand>
    {authed ? (
      <Button
        onClick={logout}
      >
        Logout
      </Button>
    )
      : (
        <Button onClick={modalDispatch.auth}>Login</Button>
      )}
  </Navbar>
)

export default Navigation

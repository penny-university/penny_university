import React from 'react'
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap'

const Navigation = () => (
  <Navbar className="h2 bg-white shadow-sm" light sticky="top">
    <NavbarBrand href="/">Penny University</NavbarBrand>
  </Navbar>
)

export default Navigation

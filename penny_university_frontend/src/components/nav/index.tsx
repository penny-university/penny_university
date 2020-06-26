import React, { useState } from 'react'
import {
  Button, Navbar, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, Container,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import modalDispatch from '../modal/dispatch'
import { User } from '../../models'
import { Routes } from '../../constants'

const Navigation = ({ user, logout }: { user: User, logout: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState: boolean) => !prevState)
  return (
    <Navbar className="h2 bg-white shadow-sm" light sticky="top">
      <Container>
        <NavbarBrand href="/">Penny University</NavbarBrand>
        {user.valid ? (

        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>
            {`Hi, ${user.displayName}!`}
          </DropdownToggle>
          <DropdownMenu>
            <div>
              <Link
                to={Routes.Profile.replace(':id', user.id.toString())}
                className="btn btn-link"
              >
                Profile
              </Link>
            </div>
            <div>
              <Button
                onClick={logout}
                  color={'link'}
                >
                  Logout
          </Button>
              </div>
            </DropdownMenu>
          </Dropdown>
        )
          : (
            <Button onClick={() => modalDispatch.auth()}>Login</Button>
          )}
      </Container>
    </Navbar >
  )
}

export default Navigation

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutFromServer, logoutFromClient } from '../../services/user.service'

const NavbarAuthUser = () => {
  const auth = useAuth()
  const { logout } = auth

  const navigate = useNavigate()

  const handleLogout = async (event) => {
    event.preventDefault()

    logoutFromClient(logout, navigate)

    logoutFromServer('/api/logout').then((res) => {
      if (res && res.data.status === 'logout successful') {
        console.log(res.data.status)
        return
      };
    }).catch((err) => {
      const { error } = err.response.data
      console.log(error)
    })
  }

  return (
    <>
      <nav className='navbar navbar-expand-lg bg-dark m-1'>
        <div className='container-fluid'>
          <Link className='navbar-brand text-white' to='#'>Navbar</Link>
          <button className='navbar-toggler bg-light p-0 rounded-0 border-0' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav ms-auto me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='/auth/show'>Products</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='/auth/user'>Account</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='/auth/sub/products'>Subscriptions</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='/auth/order/history'>Orders</Link>
              </li>
              <li className='nav-item dropdown'>
                <Link className='nav-link dropdown-toggle text-white' role='button' data-bs-toggle='dropdown' aria-expanded='false'>Cart</Link>
                <ul className='dropdown-menu'>
                  <li>
                    <Link className='dropdown-item' to='/auth/shoppingcart'>Regular</Link>
                  </li>
                  <li>
                    <Link className='dropdown-item' to='/auth/sub/shoppingcart'>Subscription</Link>
                  </li>
                </ul>
              </li>
            </ul>
            <button className='p-1 ms-1 border-0 bg-dark text-white' type='submit' onClick={(e) => handleLogout(e)}>Sign-out</button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavbarAuthUser

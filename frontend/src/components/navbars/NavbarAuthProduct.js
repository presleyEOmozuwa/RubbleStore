import React from 'react'
import { Link } from 'react-router-dom'

const NavbarAuthProduct = () => {
  return (
    <>
      <nav className='navbar navbar-expand-lg bg-dark m-1'>
        <div className='container-fluid'>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav ms-auto me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='#'>Docs</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='#'>Pricing</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link text-white' to='#'>Api</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavbarAuthProduct

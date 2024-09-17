import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './User.css'
import { getUser } from '../../services/user.service'
import { manageBillingHandler } from '../../services/stripe.service'
import { toast } from 'react-toastify'

const UserDetails = () => {
  const [appuser, setUser] = useState({
    id: '',
    username: '',
    email: '',
    role: ''
  })

  const { username } = appuser

  const navigate = useNavigate()

  const handleSubPortal = async (event) => {
    event.preventDefault()
    manageBillingHandler('/api/stripe/customer/portal').then((res) => {
      console.log(res.data)
      if (res && res.data) {
        window.location.href = res.data.url
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login')
      }
    })
  }

  // REQUEST TO RETRIEVE A USER
  useEffect(() => {
    getUser('/api/user').then((res) => {
      console.log(res.data)
      if (res && res.data.user) {
        setUser((state) => {
          const user = res?.data?.user
          const clone = {
            ...state,
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
          return clone
        })
      }
    }).catch(async (err) => {
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { auth: '/auth/user' } })
      }
    })
  }, [navigate])

  return (
    <div className='container-fluid mx-auto'>
      <div className='container-fluid'>
        <div className='row mb-3 mx-auto'>
          <div className='col text-end'>
            <span className='fw-semibold text-justify'> Hi, {username}</span>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row mb-4 w-75 mx-auto'>
          <div className='col-lg-6 p-3 shadow'>
            <div className='text-center mx-auto'>
              <h4>Profile Info</h4>
            </div>
            <p className='text-justify text-center'>Edit login, username and email and password.</p>
            <div className='text-center'>
              <Link className='text-decoration-none fw-semibold text-success' to='/auth/user/update'>Profile</Link>
            </div>

          </div>
          <div className='col-lg-6 p-3 shadow'>
            <div className='text-center mx-auto'>
              <h4> Login & Security</h4>
            </div>
            <p className='text-justify text-center'>Edit login, username and email and password.</p>
            <div className='text-center'>
              <Link className='text-decoration-none fw-semibold text-success' to='/auth/user/shared/update'>Login & Security</Link>
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row mb-4 w-75 mx-auto'>
          <div className='col-lg-6 p-3 shadow'>
            <div className='text-center mx-auto'>
              <h4> Orders & Payments</h4>
            </div>
            <p className='text-justify text-center'>Track, cancel an order</p>
            <div className='text-center'>
              <Link className='text-decoration-none fw-semibold text-success' to='/auth/order/history'>Orders & Payments</Link>
            </div>
          </div>
          <div className='col-lg-6 p-3 shadow'>
            <div className='text-center'>
              <h4> Subscriptions</h4>
            </div>

            <p className='text-justify text-center'>Manage subscriptions, view benefits and payment settings.</p>
            <div className='text-center mt-3'>
              <button className='btn btn-white p-0 px-5 py-1 border me-1 text-success fw-semibold rounded-0' onClick={(e) => handleSubPortal(e)}> Portal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default UserDetails

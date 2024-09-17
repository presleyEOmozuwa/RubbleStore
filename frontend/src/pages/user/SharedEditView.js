import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../services/user.service'
import './User.css'
import { toast } from 'react-toastify'

const SharedEditView = () => {
  const [appuser, setUser] = useState({
    userId: '',
    username: '',
    email: ''
  })

  const { username, email } = appuser

  const navigate = useNavigate()

  const handleUserName = async (event) => {
    event.preventDefault()
    navigate('/auth/user/username/update')
  }

  const handleEmail = async (event) => {
    event.preventDefault()
    navigate('/auth/user/email/update')
  }

  const handlePassword = async (event) => {
    event.preventDefault()
    navigate('/auth/user/passwordchange/update')
  }

  // REQUEST TO RETRIEVE A USER
  useEffect(() => {
    getUser('/api/user').then((res) => {
      console.log(res.data)
      if (res && res.data.user) {
        setUser((state) => {
          const user = res.data.user
          const clone = {
            ...state,
            userId: user._id,
            username: user.username,
            email: user.email
          }
          return clone
        })
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { auth: '/auth/user/shared/update' } })
      }
    })
  }, [navigate])

  return (
    <div className='container-fluid mt-5'>
      <div className='w-50 mx-auto text-center'>
        <h2 className='border-bottom'>Login & Security</h2>
      </div>
      <div className='row w-50 mx-auto py-4 mt-4'>
        <div className='col-md-6'>
          <span className='text-justify' style={{ fontSize: '18px' }}>Username</span>
          <p className='text-justify'>{username}</p>
        </div>
        <div className='col-md-6 text-end'>
          <button className='btn btn-primary border fw-semibold px-5 py-1 rounded-0 shadow' onClick={(e) => handleUserName(e)}> Edit </button>
        </div>
      </div>
      <div className='row w-50 mx-auto py-4'>
        <div className='col-md-6'>
          <span className='text-justify' style={{ fontSize: '18px' }}>Email Address</span>
          <p className='text-justify'>{email}</p>
        </div>
        <div className='col-md-6 text-end'>
          <button className='btn btn-primary border fw-semibold px-5 py-1 rounded-0 shadow' onClick={(e) => handleEmail(e)}> Edit </button>
        </div>
      </div>
      <div className='row w-50 mx-auto py-4'>
        <div className='col-md-6'>
          <span className='text-justify' style={{ fontSize: '18px' }}>Password</span>
          <p className='text-justify'>Change Password</p>
        </div>
        <div className='col-md-6 text-end'>
          <button className='btn btn-primary border fw-semibold px-5 py-1 rounded-0 shadow' onClick={(e) => handlePassword(e)}> Edit </button>
        </div>
      </div>
    </div>
  )
}
export default SharedEditView

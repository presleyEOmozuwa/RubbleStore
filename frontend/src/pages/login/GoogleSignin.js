import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'

const GoogleSignin = () => {
  const auth = useAuth()
  const { login } = auth

  const navigate = useNavigate()

  const sender = async (val) => {
    try {
      const payload = {
        clientId: val.clientId,
        token: val.credential
      }

      console.log(payload)
      const res = await axios.post('/api/google-signin', { payload })
      console.log('User successfully logged in')

      if (res && res?.data.status === 'login successful') {
        login(res.data.user)

        const { role } = res.data.user

        if (role === 'admin') {
          return navigate('/admin/system', { replace: true })
        } else if (role === 'client') {
          return navigate('/auth/user', { replace: true })
        } else {
          return navigate('/', { replace: true })
        }
      }
    } catch (err) {
      if (err && err.response) {
        const { error } = err.response.data
        if (error === 'authentication failed, contact google') {
          // onSubmitProps.resetForm();
          toast.info(error)
        }

        if (error === 'email is associated to a closed account') {
          // onSubmitProps.resetForm();
          toast.info(error)
        }
        if (error === 'email is associated to a blocked account') {
          // onSubmitProps.resetForm();
          toast.info('your account has been blocked, call customer support for help.', { autoClose: 6000 })
        }
      }
    }
  }

  return (
    <>
      <GoogleLogin
        onSuccess={(response) => {
          console.log(response)
          sender(response)
        }}
        type='standard'
        shape='rectangular'
        size='large'
        onError={() => console.log('Login Failed')}
      />
    </>
  )
}

export default GoogleSignin

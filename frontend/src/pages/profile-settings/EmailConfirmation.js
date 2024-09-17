import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { emailConfirmHandler } from '../../services/email.service'

const EmailConfirmation = () => {
  const { token } = useParams()

  useEffect(() => {
    emailConfirmHandler('/api/email-confirmation', { token }).then((res) => {
      console.log(res.data)
      if (res && res.data.isEmailConfirmed) {
        console.log('Email confirmation successful')
        // NOTIFY THE USER OF SUCCESSFUL REGISTRATION
      }
    }).catch((err) => {
      if (err.response) {
        const { error } = err.response.data
        if (error === 'no token payload found') {
          console.log(error)
          // RE-NOTIFY THE USER TO CHECK THEIR INBOX FOR EMAIL CONFIRMATION LINK IN ORDER TO COMPLETE THE REGISTRATION PROCESS
        }
      }
    })
  }, [token])

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center p-3'>
        <div className='col-lg-12 bg-primary text-center p-5 border'>
          <p className='text-white display-6'> Registration Successful </p>
          <p className='text-white fs-5'> Click on the Login link above to continue.. </p>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmation

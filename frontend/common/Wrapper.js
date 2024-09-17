import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '../src/context/AuthContext'

const Wrapper = ({ children }) => {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </AuthProvider>
  )
}

export default Wrapper

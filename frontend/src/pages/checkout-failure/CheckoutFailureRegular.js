import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkoutFailureMultipleHandler } from '../../services/stripe.service'
import './CheckoutFailure.css'
import { toast } from 'react-toastify'

const CheckoutFailureRegular = () => {
  const { sessionId } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    checkoutFailureMultipleHandler(`/api/checkout/failure/regular/${sessionId}`).then((res) => {
      if (res && res.data) {
        console.log(res.data.status)
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
  }, [sessionId, navigate])

  return (
    <div className='container-fluid mt-5'>
      <div className='row w-50 mx-auto'>
        <div className='p-2'>
          <div className='text-center'>
            <h2 className='fs-2 border-bottom mb-4'>Session Cancelled</h2>
          </div>
          <p className='fs-4 text-justify text-center'>
            Sorry, your session was interrupted
            check if something is wrong with your network
            and try again later.
          </p>

        </div>
      </div>

    </div>
  )
}

export default CheckoutFailureRegular

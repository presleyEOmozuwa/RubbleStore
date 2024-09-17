import React from 'react'
import { useNavigate } from 'react-router-dom'
import { singleSubHandler } from '../../services/stripe.service'
import { toast } from 'react-toastify'

const SingleSubscriptionItem = ({ cartItems }) => {
  const navigate = useNavigate()
  const handleBuyNow = async () => {
    singleSubHandler('/api/sub/single/create-checkout-session', { cartItems }).then((res) => {
      if (res && res.data.url) {
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

  return (
    <>
      <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={() => handleBuyNow()}>BuyNow</button>
    </>
  )
}

export default SingleSubscriptionItem

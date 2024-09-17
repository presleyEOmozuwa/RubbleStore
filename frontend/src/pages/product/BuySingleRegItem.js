import React from 'react'
import { useNavigate } from 'react-router-dom'
import { singleRegularHandler } from '../../services/stripe.service'
import { toast } from 'react-toastify'

const SingleRegularItem = ({ cartItems }) => {
  const navigate = useNavigate()
  const handleBuyNow = async (event) => {
    event.preventDefault()
    singleRegularHandler('/api/single/regular/create-checkout-session', { cartItems }).then((res) => {
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
      <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={(e) => handleBuyNow(e)}>BuyNow</button>
    </>
  )
}

export default SingleRegularItem

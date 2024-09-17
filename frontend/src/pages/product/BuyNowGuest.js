import React from 'react'
import { toast } from 'react-toastify'

const BuyNowGuest = () => {
  const handleBuyNow = async (event) => {
    event.preventDefault()
    toast.info('Login to continue')
  }

  return (
    <>
      <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={(e) => handleBuyNow(e)}>BuyNow</button>
    </>
  )
}

export default BuyNowGuest

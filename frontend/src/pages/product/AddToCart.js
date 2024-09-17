import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addItemToCart } from '../../services/product.service'

const AddToCart = ({ productId }) => {
  const navigate = useNavigate()

  const handleAddtoCart = async (event) => {
    event.preventDefault()
    addItemToCart('/api/addtocart/guestUser', { productId }).then((res) => {
      if (res && res?.data?.status === 'product successfully added to cart') {
        navigate('/cart/guest')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (err.response) {
        console.log(error)
        navigate('/cart/guest')
      }
    })
  }

  return (
    <>
      <span className='mt-1'>
        <button className='border px-4 py-1 ms-2 bg-primary text-white shadow' onClick={(e) => handleAddtoCart(e)}>Add to Cart</button>
      </span>
    </>
  )
}

export default AddToCart

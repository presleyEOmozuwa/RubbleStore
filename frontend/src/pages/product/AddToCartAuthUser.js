import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addItemToCart } from '../../services/product.service'
import { toast } from 'react-toastify'

const AddToCartAuthUser = ({ productId, typeOfItem }) => {
  const navigate = useNavigate()

  const handleAddtoCart = async (event) => {
    event.preventDefault()
    if (typeOfItem === 'regular') {
      addItemToCart('/api/addtocart/loggedInUser', { productId }).then((res) => {
        if (res && res?.data?.status === 'product successfully added to cart') {
          navigate('/auth/shoppingcart')
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
    } else if (typeOfItem === 'subscription') {
      addItemToCart('/api/sub/addtocart', { productId }).then((res) => {
        if (res && res.data.status === 'product successfully added to subcart') {
          navigate('/auth/sub/shoppingcart')
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
  }

  return (
    <>
      <span className='mt-1'>
        <button className='border px-4 py-1 ms-2 bg-primary text-white shadow' onClick={(e) => handleAddtoCart(e)}>Add to Cart</button>
      </span>
    </>
  )
}

export default AddToCartAuthUser

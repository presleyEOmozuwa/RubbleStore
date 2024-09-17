import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ShoppingCart from './ShoppingCart'
import { getCartItems } from '../../services/product.service'
import { toast } from 'react-toastify'

const ShoppingCartBuilder = () => {
  const [cartObj, setCartObj] = useState({ products: [] })
  const { products } = cartObj
  const activeProducts = JSON.stringify(products)

  const [deletedProduct, setDeletedProduct] = useState({ })

  const navigate = useNavigate()

  useEffect(() => {
    getCartItems('/api/cart').then((res) => {
      console.log(res.data.cart.products)
      if (res && res.data.cart) {
        const cartProducts = res.data.cart.products
        setCartObj((state) => {
          return {
            ...state,
            products: cartProducts
          }
        })
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login')
      } else if (error && error === 'product already exist on cart') {
        toast.info(error)
      }
    })
  }, [activeProducts, deletedProduct._id, navigate])

  return (
    <ShoppingCart products={products} initAmount={0} setDeletedProduct={setDeletedProduct} />
  )
}

export default ShoppingCartBuilder

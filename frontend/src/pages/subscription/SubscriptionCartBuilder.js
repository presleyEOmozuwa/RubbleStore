import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubscriptionCart from './SubscriptionCart'
import { getCartItems } from '../../services/product.service'
import { toast } from 'react-toastify'

const SubscriptionCartBuilder = () => {
  const [subCartObj, setSubCartObj] = useState({ products: [] })
  const { products } = subCartObj
  const activeProducts = JSON.stringify(products)

  const [deletedProduct, setDeletedProduct] = useState({ })

  const navigate = useNavigate()

  // REQUEST TO GET ALL CART ITEMS
  useEffect(() => {
    getCartItems('/api/sub/cart').then((res) => {
      console.log(res)
      if (res && res.data.subcart) {
        console.log(res.data.subcart)
        setSubCartObj((state) => {
          return {
            ...state,
            products: res.data.subcart?.subItems
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
      }
    })
  }, [activeProducts, deletedProduct._id, navigate])

  return (
    <SubscriptionCart products={products} initAmount={0} setDeletedProduct={setDeletedProduct} />
  )
}

export default SubscriptionCartBuilder

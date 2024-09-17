import React, { useState, useEffect } from 'react'
import axios from 'axios'
import GuestUser from './GuestUser'

const GuestUserBuilder = () => {
  const [products, setProducts] = useState([])
  const activeProducts = JSON.stringify(products)

  const [deletedItem, setDeletedItem] = useState({ })

  // REQUEST FOR ALL PRODUCTS ADDED TO CART BY USER
  useEffect(() => {
    const sender = async () => {
      try {
        const val = await axios.get('/api/shopping-cart/guestUser', { withCredentials: true })

        if (val && val.data.cart) {
          const cartProducts = val.data.cart?.products
          setProducts(cartProducts)
        }
      } catch (err) {
        const { error } = err.response.data
        console.log(error)
      }
    }
    sender()
  }, [activeProducts, deletedItem._id])

  return (
    <GuestUser products={products} initAmount={0} setDeletedItem={setDeletedItem} />
  )
}

export default GuestUserBuilder

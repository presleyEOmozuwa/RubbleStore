import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ShoppingCart.css'
import { deleteCartItem } from '../../services/product.service'
import { multipleRegularHandler } from '../../services/stripe.service'
import { totalHandler } from '../../utils/helper'
import { toast } from 'react-toastify'

const ShoppingCart = ({ products, initAmount, setDeletedProduct }) => {
  const [totalAmount, setTotalAmount] = useState(0)

  const navigate = useNavigate()

  const handleQty = (event, productId) => {
    const modified = [...products]
    modified.forEach((p) => {
      if (productId === p._id) {
        p.quantity = parseInt(event.target.value)
      }
    })

    const total = modified.reduce((sum, p) => {
      return sum + (p.quantity * p.newPrice)
    }, 0)

    setTotalAmount(total)
  }

  const handleCheckout = async (event) => {
    event.preventDefault()
    console.log(products)
    multipleRegularHandler('/api/regular/multiple/create-checkout-session', { cartItems: products }).then((res) => {
      console.log(res.data)
      if (res && res.data) {
        window.location.href = res.data.url
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { from: '/auth/shoppingcart' } })
      }
    })
  }

  // REQUEST TO REMOVE AN ITEM FROM THE CART
  const handleDelete = async (event) => {
    deleteCartItem(`/api/removefromcart/${event.target.value}`).then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'product removed from cart successfully') {
        setDeletedProduct(res.data.product)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { from: '/auth/shoppingcart' } })
      }
    })
  }

  if (products.length === 0) {
    return (
      <div className='container-fluid mt-3 p-3 vh-100'>
        <div className='row w-75 mx-auto'>
          <div className='col-lg-9'>
            <h2 className='fw-light text-center pt-2 align-self-center'>Regular Shopping Cart </h2>
            <p className='text-justify' style={{ fontSize: '16px' }}>The Cart is a temporary place to store a list of your items and reflects each item's most recent price.
              Do you have a gift card or promotional code? We'll ask you to enter your claim code when it's time to pay.
            </p>
            <Link to='/auth/sub/shoppingcart'>Go to Subscription Cart</Link>
          </div>
          <div className='col-lg-3'>
            <h2 className='fw-light m-0 text-center text-muted'> Summary</h2>
            <div className=' my-1'>
              <p className='fw-bold m-0 text-center text-justify'> Items : {products?.length <= 1 ? products?.length + ' item' : products?.length + ' items'}</p>

              <p className='mb-3 text-center text-justify'> Total : <span className='fs-5 text-success fw-bold'>${initAmount.toFixed(2)}</span></p>

              <div className='text-center'>
                <Link className='border px-4 py-2 bg-danger text-white fw-bolder shadow text-decoration-none text-justify' to='/auth/show'> Checkout </Link>
              </div>

            </div>
          </div>
        </div>
        <div className='row mt-4 show-cart'>
          <div className='col-sm-3' />
          <div className='col-sm-6 p-5 shadow empty'>
            <p className='display-5 mb-2'> Your Cart is Empty! </p>
            <Link className='me-1 border py-1 px-3 bg-danger text-white fw-bolder shadow text-decoration-none' to='/auth/show'> Shop Now </Link>
          </div>
          <div className='col-sm-3' />
        </div>

      </div>
    )
  } else if (products.length >= 1) {
    return (
      <div className='container-fluid mt-3 p-3 vh-100'>
        <div className='row w-75 mx-auto'>
          <div className='col-lg-9'>
            <h2 className='fw-light text-center pt-2 align-self-center'>Regular Shopping Cart </h2>
            <p className='text-justify' style={{ fontSize: '16px' }}>The Cart is a temporary place to store a list of your items and reflects each item's most recent price.
              Do you have a gift card or promotional code? We'll ask you to enter your claim code when it's time to pay.
            </p>
            <Link to='/auth/sub/shoppingcart' style={{ textDecoration: 'underline' }}>Go to Subscription Cart</Link>
          </div>
          <div className='col-lg-3 text-center pt-2'>
            <h2 className='fw-light m-0 text-muted'> Summary</h2>

            <p className='fw-bold m-0'> Items : {products?.length <= 1 ? products?.length + ' item' : products?.length + ' items'}</p>

            <p className='mb-2 ms-3'> Total : <span className='fs-5 text-success fw-bold'>${totalAmount === 0 ? totalHandler(products).toFixed(2) : totalAmount.toFixed(2)}</span></p>

            <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={(e) => handleCheckout(e)}>Checkout</button>
          </div>
        </div>

        <div className='row p-4 mt-4'>
          {products?.map((p, i) => {
            return (
              <div key={i} className='col-lg-4 sect p-3 rounded shadow bg-white'>
                <div className='border shadow mb-3'>
                  <img src={p.imageUrl} width='100%' alt={p.prodName} />
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Name</p>
                    </div>
                    <div className='col-lg-6'>
                      <Link className='fw-semibold' to={`/common/product/${p._id}`}>{p.prodName}</Link>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Price</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>{p.price}</p>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Coupon</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>{p.coupon}</p>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>New Price</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>{p.newPrice}</p>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Quantity</p>
                    </div>
                    <div className='col-lg-6'>
                      <select className='me-5 ms-1 qty' onChange={(e) => handleQty(e, p._id)}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q, index) => {
                          return (
                            <option key={index} value={q}>{q}</option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='text-end'>
                  <button className='btn btn-danger rounded-0 shadow p-0 px-2  fw-bold' type='submit' value={p._id} onClick={(e) => handleDelete(e)}>del</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ShoppingCart

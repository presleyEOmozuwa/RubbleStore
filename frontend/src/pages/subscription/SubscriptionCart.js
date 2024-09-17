/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { totalHandler } from '../../utils/helper'
import { deleteCartItem } from '../../services/product.service'
import { multipleSubHandler } from '../../services/stripe.service'
import './SubscriptionCart.css'
import { toast } from 'react-toastify'

const SubscriptionCart = ({ products, initAmount, setDeletedProduct }) => {
  const [totalAmount, setTotalAmount] = useState(0)

  const navigate = useNavigate()

  const handleCheckout = (event) => {
    event.preventDefault()
    multipleSubHandler('/api/sub/multiple/create-checkout-session', { cartItems: products }).then((res) => {
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
        navigate('/login', { state: { auth: '/auth/sub/shoppingcart' } })
      } else if (error && error === 'you cannot subscribe to the same item twice') {
        toast.info(error)
      }
    })
  }

  // REQUEST TO REMOVE AN ITEM FROM THE CART
  const handleDelete = async (event) => {
    deleteCartItem(`/api/sub/removefromcart/${event.target.value}`).then((res) => {
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
        navigate('/login', { state: { auth: '/auth/sub/shoppingcart' } })
      }
    })
  }

  if (products.length === 0) {
    return (
      <div className='container-fluid mt-3 p-3 vh-100'>

        <div className='row w-75 mx-auto'>
          <div className='col-lg-9'>
            <h2 className='fw-light text-center pt-2 align-self-center'>Subscription Cart </h2>
            <p className='text-justify' style={{ fontSize: '16px' }}>The Cart is a temporary place to store a list of your items and reflects each item's most recent price.
              Do you have a gift card or promotional code? We'll ask you to enter your claim code when it's time to pay.
            </p>
            <Link to='/auth/shoppingcart' style={{ textDecoration: 'underline' }}>Go to Regular Cart</Link>
          </div>
          <div className='col-lg-3 text-center'>
            <h2 className='fw-light m-0 text-muted'> Summary</h2>
            <div className='text-center my-1'>
              <p className='fw-bold m-0'> Items : {products?.length <= 1 ? products?.length + ' item' : products?.length + ' items'}</p>

              <p className='mb-3'> Total : <span className='fs-5 text-success fw-bold'>${initAmount.toFixed(2)}</span></p>

              <Link className='border px-4 py-2 bg-danger text-white fw-bolder shadow text-decoration-none' to='/auth/show'> Checkout </Link>
            </div>
          </div>
        </div>
        <div className='row mt-4 show-cart'>
          <div className='col-sm-3' />
          <div className='col-sm-6 p-5 shadow empty'>
            <p className='display-5 mb-2'> Your Cart is Empty! </p>
            <Link className='me-1 border py-1 px-3 bg-danger text-white fw-bolder shadow text-decoration-none' to='/auth/sub/products'> Shop Now </Link>
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
            <h2 className='fw-light text-center pt-2 align-self-center'>Subscription Cart </h2>
            <p className='text-justify' style={{ fontSize: '16px' }}>The Cart is a temporary place to store a list of your items and reflects each item's most recent price.
              Do you have a gift card or promotional code? We'll ask you to enter your claim code when it's time to pay.
            </p>
            <Link to='/auth/shoppingcart' style={{ textDecoration: 'underline' }}>Go to Regular Cart</Link>
          </div>
          <div className='col-lg-3 text-center'>
            <h2 className='fw-light m-0 text-muted'> Summary</h2>

            <p className='fw-bold m-0'> Items : {products?.length <= 1 ? products?.length + ' item' : products?.length + ' items'}</p>

            <p className='mb-2 ms-3'> Total : <span className='fs-5 text-success fw-bold'>${totalAmount === 0 ? totalHandler(products).toFixed(2) : totalHandler(products).toFixed(2)}</span></p>

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
                      <Link className='fw-semibold cart-name p-0' to={`/common/product/${p._id}`}>{p.prodName}</Link>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Price</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>${p.price} per month</p>
                    </div>
                  </div>
                </div>
                <div className={p.coupon ? 'mb-2' : ''}>
                  <div className='row mx-auto'>
                    {p.coupon
                      ? <>
                        <div className='col-lg-6'>
                          <p>New Price</p>
                        </div>
                        <div className='col-lg-6'>
                          <p>{p.newPrice}%</p>
                        </div>
                      </>
                      : null}
                  </div>
                </div>
                <div className=''>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Quantity</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>{p.quantity}</p>
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

/* eslint-enable no-unused-vars */

export default SubscriptionCart

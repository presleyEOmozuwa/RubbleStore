import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkoutSuccessMultiple } from '../../services/stripe.service'
import { toast } from 'react-toastify'

const CheckoutSuccessReg = () => {
  const [orderStore, setOrderStore] = useState({ order: {} })
  const { order } = orderStore

  const { sessionId } = useParams()

  const navigate = useNavigate()

  const handleBuyAgain = (event) => {
    event.preventDefault()
    navigate('/auth/show')
  }

  const handleGoToOrders = (event) => {
    event.preventDefault()
    navigate('/auth/order/history')
  }

  useEffect(() => {
    checkoutSuccessMultiple(`/api/checkout/success/regular/${sessionId}`).then((res) => {
      if (res && res.data) {
        console.log(sessionId)
        console.log(res.data.status)
        console.log(res.data.order)
        setOrderStore((state) => {
          return {
            ...state,
            order: res.data.order
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
      } else if (error && error === 'unecessary reload') {
        navigate('/auth/order/history')
      }
    })
  }, [sessionId, navigate])

  return (
    <div className='container-lg mx-auto'>
      <div className='container mx-auto'>
        <p className='display-5 text-justify mb-3'>Successful Payment</p>
        <div className='row justify-content-center mb-2'>
          <div className='col-lg-4'>
            <span className='fs-4 text-justify'>Order placed, thanks!</span>
            <p className='text-justify'>Confirmation will be sent to your email.</p>
          </div>
          <div className='col-lg-4' />
          <div className='col-lg-4' />
        </div>
        <div className='row justify-content-center mb-3'>
          <div className='col-lg-3'>
            <small className='text-justify'>ORDER PLACED</small>
            <p><small className='text-justify'>{order.orderplaced}</small></p>
          </div>
          <div className='col-lg-3'>
            <small className='text-justify'>SHIP TO</small>
            <p className='text-justify'>{order.customerAddress?.name}</p>
          </div>
          <div className='col-lg-3'>
            <small className='text-justify'>ESTIMATED DELIVERY</small>
            <p> <small className='text-justify'>DATE</small> : {order.estimatedDeliveryDate}</p>
          </div>
          <div className='col-lg-3' />
        </div>
        {order.cartItems?.map((product, index) => {
          return (
            <React.Fragment key={index}>
              <div className='row justify-content-center mb-4'>
                <div className='col-lg-3 mt-1'>
                  <img className='img-fluid' src={product.imageUrl} alt='sofa display' width='55%' />
                </div>
                <div className='col-lg-4'>
                  <div className='mb-1'>
                    <span className='text-success fw-semibold text-justify'>{product.des}</span>
                  </div>
                  <div>
                    <button className='btn btn-white p-0 px-2 py-1 border me-1 rounded-0' onClick={(e) => handleBuyAgain(e)}> Buy it again</button>
                    <button className='btn btn-white p-0 px-2 py-1 border rounded-0'> <small className='text-justify'> View your item </small></button>
                  </div>
                </div>
                <div className='col-lg-5' />
              </div>
            </React.Fragment>
          )
        })}
        <div className='row mt-4'>
          <div className='col-lg-3'>
            <button className='btn btn-primary p-0 px-5 py-1 border me-1 rounded-0' onClick={(e) => handleGoToOrders(e)}> Go to orders</button>
          </div>
          <div className='col-lg-2' />
          <div className='col-lg-7' />
        </div>
      </div>
    </div>

  )
}

export default CheckoutSuccessReg

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../services/order.service'
import { totalBeforeTax, totalAfterTax } from './helper'
import './OrderStore.css'
import { toast } from 'react-toastify'

const OrderDetails = () => {
  const [order, setOrder] = useState({})

  const params = useParams()
  const { sessionId } = params

  const navigate = useNavigate()

  const handleViewInvoice = async (event) => {
    event.preventDefault()
    navigate(`/auth/order/details/invoice/${sessionId}`)
  }

  useEffect(() => {
    getOrder(`/api/order-details/${sessionId}`).then((res) => {
      if (res && res?.data.order) {
        console.log(res?.data.order)
        setOrder(res.data.order)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { auth: `/auth/order/details/invoice/${sessionId}` } })
      }
    })
  }, [sessionId, navigate])

  return (
    <div className='container-lg mx-auto p-2'>
      <p className='display-6 text-center text-justify'>Order Details</p>
      <div className='container mx-auto p-2 border-bottom'>
        <div className='row mx-auto p-2'>
          <div className='col-lg-4 p-2'>
            <div className=''>
              <p className='text-center text-justify'><span className='fw-semibold'>Ordered On </span>{order.orderplaced}</p>
            </div>
          </div>
          <div className='col-lg-4 p-2 text-center'>
            <div className=''>
              <p className='text-center text-justify'><span className='fw-semibold'>OrderNumber</span> {order.orderNumber}</p>
            </div>
          </div>
          <div className='col-lg-4 p-2 text-center'>
            <button className='btn btn-white p-0 px-3 border' onClick={(e) => handleViewInvoice(e)}><small> View or Print invoice </small></button>
          </div>
        </div>
      </div>
      <div className='container mx-auto p-2'>
        <div className='row mx-auto p-2'>
          <div className='col-lg-4 p-2'>
            <div className=''>
              <h5 className='text-center text-justify'>Shipping Address</h5>
              <p className='m-0 text-center text-justify'>{order.customerAddress?.name}</p>
              <p className='m-0 text-center text-justify'>{order.customerAddress?.line1}, {order.customerAddress?.line2}</p>
              <p className='m-0 text-center text-justify'>{order.customerAddress?.city}, {order.customerAddress?.state} {order.customerAddress?.postalcode}</p>
            </div>
          </div>
          <div className='col-lg-4 p-2'>
            <div className='text-center'>
              <h5 className='text-justify'>Payment Method</h5>
              <p><small className='border fw-bold p-1 text-primary'>VISA</small> ending in {order.last4}</p>
            </div>

          </div>
          <div className='col-lg-4 p-2'>
            <div className='text-center'>
              <h5 className='text-justify'>Summary</h5>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span className='text-justify fw-semibold'>Subtotal</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span className='text-justify'>${order.orderTotal}</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span>Shipping</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${order.shipping}.00</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span>Total before tax</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${totalBeforeTax(order.orderTotal, order.shipping)}</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span>Estimated tax</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${order.tax}.00</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span className='fw-semibold'>Grand total</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${totalAfterTax(order.orderTotal, order.shipping, order.tax)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

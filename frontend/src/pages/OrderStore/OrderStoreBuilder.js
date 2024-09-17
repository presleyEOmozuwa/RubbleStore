import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getOrders } from '../../services/order.service'
import OrderHistory from './OrderHistory.js'
import { toast } from 'react-toastify'

const OrderStoreBuilder = () => {
  const [orderStore, setOrder] = useState({ orders: [] })
  const { orders } = orderStore
  const navigate = useNavigate()
  const activeOrders = JSON.stringify(orders)

  useEffect(() => {
    getOrders('/api/order/history').then((res) => {
      if (res && res?.data.orderArchive) {
        setOrder((state) => {
          console.log(res.data.orderArchive.orders)
          return {
            ...state,
            orders: res.data.orderArchive.orders
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
  }, [activeOrders, navigate])

  if (orders.length === 0) {
    return (
      <div className='container-fluid mt-3 p-3 vh-100 shared'>
        <div className='row w-75 mx-auto'>
          <div className='col-lg-3' />
          <div className='col-lg-6'>
            <h1 className='fw-light text-center text-justify pt-2  border-bottom mb-4'> Orders & Payments </h1>
          </div>
          <div className='col-lg-3' />
        </div>
        <div className='row w-75 mt-4 show-cart mx-auto'>
          <div className='col-sm-3' />
          <div className='col-sm-6 p-5 shadow empty'>
            <div className='text-center'>
              <h2 className='mb-3 text-justify'>No Order History!</h2>
            </div>
            <div className='text-center'>
              <Link className='fs-5 text-decoration-none' to='/auth/show'> <button className='p-0 px-4 py-1 btn btn-danger rounded-0 fw-semibold text-justify'>Shop Now</button></Link>
            </div>
          </div>
          <div className='col-sm-3' />
        </div>

      </div>
    )
  }

  return (
    <>
      {orders.map((order, i) => {
        return (
          <OrderHistory key={i} order={order} />
        )
      })}
    </>
  )
}

export default OrderStoreBuilder

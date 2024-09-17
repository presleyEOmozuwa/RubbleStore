import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

const OrderHistory = ({ order }) => {
  const navigate = useNavigate()

  const handleBuyAgain = (event) => {
    event.preventDefault()
    navigate(`/common/product/${event.target.value}`)
  }

  const handleTrackPackage = async (event) => {
    event.preventDefault()
    window.location.href = order.deliveryTrackingUrl
  }

  const handleProductQuestion = async (event) => {
    event.preventDefault()
  }

  const handleProductReview = async (event) => {
    event.preventDefault()
  }

  return (
    <>
      <div className='container-fluid mt-3 p-4 pt-1 justify-content-center border-bottom shadow'>
        <div className='row justify-content-center mb-3 bg-light pt-0'>
          <div className='col-lg-3'>
            <small className='text-justify'>ORDER PLACED</small>
            <p className='text-justify'>{order.orderplaced}</p>
          </div>
          <div className='col-lg-3'>
            <small className='text-justify'>ESTIMATED DELIVERY DATE</small>
            <p className='text-justify'>{order.estimatedDeliveryDate}</p>
          </div>
          <div className='col-lg-3'>
            <small className='m-0 text-justify'>DELIVERY STATUS</small>
            <div className='m-0'>
              <button className='btn btn-white p-0 px-5 border me-1 ' onClick={(e) => handleTrackPackage(e)}> Track Package </button>
            </div>

          </div>
          <div className='col-lg-3'>
            <small className='text-justify'>ORDER {order.orderNumber}</small>
            <div className='m-0'>
              <Link className='text-decoration-none text-success fw-semibold text-justify' to={`/auth/order/details/${order.checkoutSessionId}`}>View order details</Link>
            </div>
          </div>
        </div>
        {order.cartItems?.map((product, index) => {
          return (
            <React.Fragment key={index}>
              <div className='row justify-content-center mb-4'>
                <div className='col-lg-3 mt-1'>
                  <img className='img-fluid mb-1' src={product.imageUrl} alt='sofa display' width='55%' />
                  <p className='ms-4'>{product.prodName}</p>
                </div>
                <div className='col-lg-4'>
                  <div className='mb-1'>
                    <span className='text-success fw-semibold text-justify'>{product.des}</span>
                  </div>
                  <div>
                    <button className='btn btn-white p-0 px-2 py-1 border me-1 rounded-0' onClick={(e) => handleBuyAgain(e)} value={product._id}> Buy it again</button>
                    <button className='btn btn-white p-0 px-2 py-1 border text-justify rounded-0'>View your item</button>
                  </div>
                </div>
                <div className='col-lg-5'>
                  <div className='text-center'>
                    <button className='btn btn-white p-0 px-4 py-1 border mb-1 text-justify rounded-0' onClick={(e) => handleProductQuestion(e)}> Ask product question</button>
                    <div className='m-0'>
                      <button className='btn btn-white p-0 px-4 py-1 border text-justify rounded-0' onClick={(e) => handleProductReview(e)}>Write product review</button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}

export default OrderHistory

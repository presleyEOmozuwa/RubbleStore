import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../services/product.service'
import { toast } from 'react-toastify'

const SubscriptionProducts = () => {
  const [products, setProducts] = useState([])
  const activeProducts = JSON.stringify(products)

  const navigate = useNavigate()

  const handleClick = (event) => {
    navigate(`/common/product/${event.target.value}`)
  }

  // REQUEST TO GET ALL PRODUCTS FOR DISPLAY
  useEffect(() => {
    getAllProducts('/api/sub/product-list').then((res) => {
      if (res.data.products) {
        setProducts(res.data.products)
      }
    }).catch(async (err) => {
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { auth: '/auth/sub/shoppingcart' } })
      }
    })
  }, [activeProducts, navigate])

  return (
    <div>
      <div className='container-fluid pt-3'>
        <div className='d-flex justify-content-center align-items-center'>
          <h2 className='fw-light display-6 text-muted'> Subscriptions</h2>
        </div>
        <div className='row mx-3 p-4'>
          {products.map((product, index) => {
            return (
              <div key={index} className='col-lg-4 p-4 shadow sect mb-2 px-4 rounded'>
                <div className='border shadow mb-3'>
                  <img src={product.imageUrl} width='100%' alt={product.prodName} />
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Name</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>{product.prodName}</p>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    <div className='col-lg-6'>
                      <p>Price</p>
                    </div>
                    <div className='col-lg-6'>
                      <p>${product.price} per month</p>
                    </div>
                  </div>
                </div>
                <div className='mb-2'>
                  <div className='row mx-auto'>
                    {product.coupon
                      ? <>
                        <div className='col-lg-6'>
                          <p>Coupon</p>
                        </div>
                        <div className='col-lg-6'>
                          <p>{product.coupon}%</p>
                        </div>
                        </>
                      : null}
                  </div>
                </div>
                <div className='d-grid gap-2 col-10 rounded-0 shadow mx-auto'>
                  <button className='btn btn-primary' type='button' onClick={(e) => handleClick(e)} value={product._id}>Subscribe</button>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionProducts

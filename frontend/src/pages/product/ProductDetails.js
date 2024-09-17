import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Product.css'
import AddToCart from './AddToCart'
import { getProduct } from '../../services/product.service'
import BuyNowGuest from './BuyNowGuest'

const ProductDetails = () => {
  const [product, setProduct] = useState({ id: '', prodName: '', price: 0, coupon: 0, newPrice: 0, priceId: '', imageUrl: '', quantity: 0, typeOfItem: '', des: '' })

  const { id, prodName, price, coupon, newPrice, imageUrl, typeOfItem, des } = product

  const params = useParams()
  const { productId } = params

  const navigate = useNavigate()

  // REQUEST TO GET A PRODUCT
  useEffect(() => {
    getProduct(`/api/product-details/${productId}`).then((res) => {
      if (res && res?.data?.product) {
        setProduct((state) => {
          const data = res?.data?.product
          const clone = {
            ...state,
            id: data._id,
            prodName: data.prodName,
            price: data.price,
            coupon: data.coupon,
            newPrice: data.newPrice,
            priceId: data.priceId,
            stockQty: data.stockQty,
            des: data.des,
            quantity: data.quantity,
            typeOfItem: data.typeOfItem,
            imageUrl: data.imageUrl
          }
          return clone
        })
      }
    }).catch(async (err) => {
      const { error } = err.response.data
      console.log(error)
    })
  }, [productId, navigate])

  return (
    <div className='container-fluid mt-4'>
      <div className='row'>
        <div className='col-lg-4' />
        <div className='col-lg-4 p-4 shadow sect mb-2 rounded'>
          <div className='border shadow mb-3'>
            <img className='img-fluid' src={imageUrl} width='100%' alt={prodName} />
          </div>
          <div className='mb-2'>
            <div className='row mx-auto'>
              <div className='col-lg-6'>
                <p>Name</p>
              </div>
              <div className='col-lg-6'>
                <p>{prodName}</p>
              </div>
            </div>
          </div>
          <div className='mb-2'>
            <div className='row mx-auto'>
              {typeOfItem === 'subscription'
                ? <>
                  <div className='col-lg-6'>
                    <p>Price</p>
                  </div>
                  <div className='col-lg-6'>
                    <p>${price} per month</p>
                  </div>
                </>
                : <>
                  <div className='col-lg-6'>
                    <p>Price</p>
                  </div>
                  <div className='col-lg-6'>
                    <p>${price}</p>
                  </div>
                  </>}
            </div>
          </div>
          <div className='mb-2'>
            <div className='row mx-auto'>
              {coupon
                ? <>
                  <div className='col-lg-6'>
                    <p>Coupon</p>
                  </div>
                  <div className='col-lg-6'>
                    <p>{coupon}%</p>
                  </div>
                </>
                : null}
            </div>
          </div>
          <div className='mb-2'>
            <div className='row mx-auto'>
              {typeOfItem === 'subscription'
                ? <>
                  <div className='col-lg-6'>
                    <p>New Price</p>
                  </div>
                  <div className='col-lg-6'>
                    <p>${newPrice} per month</p>
                  </div>
                </>
                : <>
                  <div className='col-lg-6'>
                    <p>New Price</p>
                  </div>
                  <div className='col-lg-6'>
                    <p>${newPrice}</p>
                  </div>
                  </>}
            </div>
          </div>
          <div className='text-center mt-4'>
            <BuyNowGuest />
            <AddToCart productId={id} typeOfItem={typeOfItem} />
          </div>
        </div>
        <div className='col-lg-4 pt-5'>
          <p className='ps-3' style={{ fontSize: '20px' }}>{des}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../services/product.service'
import './Admin'

const AdminHome = () => {
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

  const handleClick = (event) => {
    navigate(`/product/${event.target.value}`)
  }

  // REQUEST TO GET ALL PRODUCTS FOR DISPLAY
  useEffect(() => {
    getAllProducts('/api/product-list').then((res) => {
      console.log(res)
      if (res.data.products) {
        setProducts(res.data.products)
      }
    }).catch((err) => {
      const { error } = err.response.data
      console.log(error)
    })
  }, [])

  return (
    <div className='container-fluid pt-4'>
      <div className='d-flex justify-content-center align-items-center'>
        <h1 className='fw-light display-5 text-muted'> Rubbles Brand Gallery </h1>
      </div>
      <div className='row mx-3 p-4'>
        {products.map((product, index) => {
          return (
            <div key={index} className='col-lg-4 p-4 shadow sect mb-2 px-4 rounded fw-bold'>
              <div className='border shadow mb-3'>
                <img src={product.imageUrl} width='100%' alt={product.prodName} />
              </div>
              <p className='card-text'><span className='fw-bold'>Name : </span> {product.prodName} </p>
              <p> <span className='fw-bold'>Price : </span>{product.price}</p>
              <p className='mb-4'> <span className='fw-bold'>Coupon : </span> {product.coupon}% off original price </p>
              <div className='d-grid gap-2 col-10 rounded-0 shadow mx-auto'>
                <button className='btn btn-primary' type='button' onClick={(e) => handleClick(e)} value={product._id}>Show Info</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminHome

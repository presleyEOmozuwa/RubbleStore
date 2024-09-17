/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../services/product.service'

const AuthShowProducts = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(3)
  const [searchVal, setSearchVal] = useState('')

  const filtered = products.filter((item) => item.prodName.toLowerCase().includes(searchVal))

  const navigate = useNavigate()
  const activeProducts = JSON.stringify(products)

  const handleClick = (event) => {
    navigate(`/common/product/${event.target.value}`)
  }

  const handlePrevious = async (event) => {
    event.preventDefault()
    if (page >= 0) {
      return setPage((page) => page - 1)
    }
  }

  const handleNext = async (event) => {
    event.preventDefault()
    if (products.length >= 1) {
      return setPage((page) => page + 1)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    setSearchVal(event.target.value)
  }

  // REQUEST TO GET ALL PRODUCTS FOR DISPLAY
  useEffect(() => {
    getAllProducts(`/api/product-list?count=${count}&page=${page}`).then((res) => {
      console.log(res)
      if (res.data.products) {
        setProducts(res.data.products)
      }
    }).catch((err) => {
      const { error } = err.response.data
      console.log(error)
    })
  }, [activeProducts, count, page])

  return (
    <div className='container-fluid'>
      <div className='row p-2'>
        <div className='col-lg-8 text-center'>
          <h2 className='fw-light text-justify'>Rubbles Gallery</h2>
        </div>
        <div className='col-lg-4 text-center sect'>
          <input className='rounded form-control' type='text' placeholder='Search Item' onChange={(e) => handleSearch(e)} />
        </div>
      </div>
      <div className='row mx-1 p-2'>
        {filtered.map((product, index) => {
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
                    <p>{product.price}</p>
                  </div>
                </div>
              </div>
              <div className='mb-4'>
                <div className='row mx-auto'>
                  <div className='col-lg-6'>
                    <p>Coupon</p>
                  </div>
                  <div className='col-lg-6'>
                    <p>{product.coupon}%</p>
                  </div>
                </div>
              </div>
              <div className='d-grid gap-2 col-10 rounded-0 shadow mx-auto'>
                <button className='btn btn-primary' type='button' onClick={(e) => handleClick(e)} value={product._id}>Show Info</button>
              </div>
            </div>
          )
        })}
      </div>
      <div className='row mb-3'>
        <div className='col-lg-4' />
        <div className='col-lg-4 text-center'>
          <button className='btn btn-white text-primary p-0 px-3 rounded-0 border me-1' onClick={(e) => handlePrevious(e)}><small> Previous </small></button>
          <button className='btn btn-white text-primary p-0 px-3 rounded-0 border ms-1' onClick={(e) => handleNext(e)}><small> Next</small></button>
        </div>
        <div className='col-lg-4' />
      </div>
    </div>
  )
}

/* eslint-enable no-unused-vars */

export default AuthShowProducts

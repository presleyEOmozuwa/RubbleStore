/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Product.css'
import { getAllProducts, deleteProduct } from '../../services/product.service'
import { toast } from 'react-toastify'

const ProductList = () => {
  const [productObj, setProducts] = useState({ products: [] })
  const { products } = productObj
  const activeProducts = JSON.stringify(products)
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(3)

  const [searchVal, setSearchVal] = useState('')

  const filtered = products.filter((item) => item.prodName.toLowerCase().includes(searchVal))

  const [deletedProduct, setDeletedProduct] = useState({})

  const navigate = useNavigate()

  const handleEdit = (event) => {
    event.preventDefault()
    navigate(`/admin/product/update/${event.target.value}`)
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

  // REQUEST TO GET ALL USERS
  useEffect(() => {
    getAllProducts(`/api/product-list?count=${count}&page=${page}`).then((res) => {
      console.log(res.data)
      if (res && res.data.products) {
        setProducts((state) => {
          const clone = {
            ...state,
            products: res.data.products
          }
          return clone
        })
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: '/admin/productlist' } })
      }
    })
  }, [activeProducts, deletedProduct._id, count, page, navigate])

  // REQUEST TO DELETE A USER
  const handleDelete = async (event) => {
    event.preventDefault()
    if (window.confirm('are you sure you want to delete product?')) {
      deleteProduct(`/api/product-delete/${event.target.value}`).then((res) => {
        console.log(res.data)
        if (res && res.data.status === 'product deleted successfully') {
          setDeletedProduct(res.data.deletedItem)
        }
      }).catch(async (err) => {
        console.log(err)
        const { error } = err.response.data
        if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
          console.log(error)
          toast.info('Session expired, login to continue', { autoClose: false })
          navigate('/login', { state: { admin: '/admin/productlist' } })
        }
      })
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-lg-8' />
        <div className='col-lg-4 sect text-center'>
          <input className='rounded form-control' type='text' placeholder='Search Item' onChange={(e) => handleSearch(e)} />
        </div>
      </div>
      <div className='row justify-content-center mb-2'>
        <div className='col-sm-1' />
        <div className='col-sm-10 border mt-5'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th scope='col'>Id</th>
                <th scope='col'>Name</th>
                <th scope='col'>Price</th>
                <th scope='col'>Coupon</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            {filtered.map((prod, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <th scope='row'>{prod._id}</th>
                    <td>{prod.prodName}</td>
                    <td>{prod.price}</td>
                    <td>{prod.coupon}</td>
                    <td>
                      <button className='btn btn-primary rounded-0 shadow p-0 px-2 m-1' type='submit' value={prod._id} onClick={(e) => handleEdit(e)}>Edit</button>
                      <button className='btn btn-danger rounded-0 shadow p-0 px-2' type='submit' value={prod._id} onClick={(e) => handleDelete(e)}>Del</button>
                    </td>
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
        <div className='col-sm-1' />
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

export default ProductList

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'
import { getSubProducts, deleteProduct } from '../../services/product.service'
import { toast } from 'react-toastify'

const AdminSubProducts = () => {
  const [subObj, setSubProducts] = useState({ products: [] })
  const { products } = subObj
  const activeProducts = JSON.stringify(products)
  const [deletedProduct, setDeletedProduct] = useState({})
  const navigate = useNavigate()

  // REQUEST TO GET ALL SUBSCRIPTION ITEMS
  useEffect(() => {
    getSubProducts('/api/sub/product-list').then((res) => {
      console.log(res.data)
      if (res && res.data.products) {
        setSubProducts((state) => {
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
        navigate('/login', { state: { admin: '/admin/sub/products' } })
      }
    })
  }, [activeProducts, deletedProduct._id, navigate])

  const handleEdit = (event) => {
    event.preventDefault()
    navigate(`/admin/product/update/${event.target.value}`)
  }

  // REQUEST TO DELETE A PRODUCT
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
          navigate('/login', { state: { admin: '/admin/sub/products' } })
        }
      })
    }
  }

  return (
    <div className='container-fluid pt-3'>
      <div className='row justify-content-center'>
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
            {products.map((prod, index) => {
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
    </div>
  )
}

export default AdminSubProducts

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Category.css'
import { getCategory, updateCategory } from '../../services/category.service'
import { toast } from 'react-toastify'

const CategoryDetailsEditForm = () => {
  const [category, setCategory] = useState({ catName: '', des: '' })
  const { catName, des } = category

  const params = useParams()
  const { categoryId } = params

  const navigate = useNavigate()

  // GET A CATEGORY
  useEffect(() => {
    getCategory(`/api/category/${categoryId}`).then((res) => {
      if (res && res.data.category) {
        setCategory((state) => {
          const data = res.data.category
          const clone = {
            ...state,
            catName: data.catName,
            des: data.description
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
        navigate('/login', { state: { admin: 'admin/categoryform' } })
      }
    })
  }, [categoryId, navigate])

  // REQUEST TO UPDATE CATEGORY DATA
  const submitHandler = async (event) => {
    event.preventDefault()
    const payload = {
      catName,
      description: des
    }
    console.log(payload)

    updateCategory('/api/category/update', { payload }).then((res) => {
      if (res && res.data.status === 'category updated successful') {
        console.log(res.data.status)
        navigate('/admin/categorylist')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: `/admin/category/update/${categoryId}` } })
      }
    })
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-4' />
        <div className='col-sm-4 border mt-5 p-4 sect'>
          <form onSubmit={(e) => submitHandler(e)}>
            <input type='hidden' />
            <div className='form-group mb-3'>
              <label htmlFor='categoryName'>Category Name</label>
              <input
                onChange={(event) => setCategory((prev) => {
                  return {
                    ...prev,
                    catName: event.target.value
                  }
                })} className='form-control rounded-0' id='categoryName' type='text' value={catName} readOnly
              />
            </div>
            <div className='form-group mb-3'>
              <label htmlFor='des'>Description</label>
              <textarea
                onChange={(event) => setCategory((prev) => {
                  return {
                    ...prev,
                    des: event.target.value
                  }
                })} className='form-control' id='des' value={des}
              />
            </div>
            <div className='form-group text-center'>
              <button className='btn btn-primary rounded-0 shadow fw-bold' type='submit'>Update</button>
            </div>
          </form>
        </div>
        <div className='col-sm-4' />
      </div>
    </div>
  )
}

export default CategoryDetailsEditForm

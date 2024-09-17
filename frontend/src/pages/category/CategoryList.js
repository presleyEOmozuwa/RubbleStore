import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Category.css'
import { deleteCategory, getAllCategories } from '../../services/category.service'
import { toast } from 'react-toastify'

const CategoryList = () => {
  const [categoryObj, setCategories] = useState({ categories: [] })
  const { categories } = categoryObj
  const activeCategories = JSON.stringify(categories)

  const [deletedCategory, setDeletedCategory] = useState({ })

  const navigate = useNavigate()

  // REQUEST TO GET ALL CATEGORIES
  useEffect(() => {
    getAllCategories('/api/category-list').then((res) => {
      if (res && res.data.categoryList) {
        setCategories((state) => {
          const clone = {
            ...state,
            categories: res.data.categoryList
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
        navigate('/login', { state: { from: '/admin/categorylist' } })
      }
    })
  }, [activeCategories, deletedCategory._id, navigate])

  const handleDelete = async (event) => {
    deleteCategory(`/api/delete/category/${event.target.value}`).then((res) => {
      if (res && res.data.status === 'category deleted successfully') {
        setDeletedCategory(res.data.deletedCategory)
        navigate('/admin/categorylist')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: '/admin/categorylist' } })
      }
    })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-1' />
        <div className='col-sm-10 border mt-5'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th scope='col'>Id</th>
                <th scope='col'>Category Name</th>
                <th scope='col'>Description</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            {categories.map((category, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <th scope='row'>{category._id}</th>
                    <td>{category.catName}</td>
                    <td>{category.description}</td>
                    <td>
                      <Link className='me-1 border py-1 px-2 bg-primary text-white fw-bold shadow' to={`/admin/category/update/${category._id}`}>Edit</Link>
                      <button className='btn btn-danger rounded-0 shadow p-0 px-2 fw-bold' type='submit' value={category._id} onClick={(e) => handleDelete(e)}>Del</button>
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

export default CategoryList

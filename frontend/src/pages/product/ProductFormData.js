/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import './Product.css'
import { getAllCategories } from '../../services/category.service'
import { createProduct } from '../../services/product.service'
import { toast } from 'react-toastify'

const ProductFormData = () => {
  const [categoryObj, setCategoryObj] = useState({ categoryArray: [] })
  const { categoryArray } = categoryObj
  const activeCategoryArray = JSON.stringify(categoryArray)

  const navigate = useNavigate()

  const initialValues =
    {
      prodName: '',
      price: 0,
      priceId: '',
      coupon: 0,
      stockQty: 0,
      des: '',
      imageUrl: '',
      typeOfItem: '',
      categories: []
    }

  const onSubmit = async (payload, onSubmitProps) => {
    console.log(payload)
    createProduct('/api/product-form/payload', { payload }).then((res) => {
      console.log(res.data)
      if (res && res.data.product.typeOfItem === 'regular') {
        // onSubmitProps.resetForm();
        navigate('/admin/productlist')
      } else {
        // onSubmitProps.resetForm();
        navigate('/admin/sub/products')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: '/admin/productform' } })
      }
    })
  }

  const validationSchema = Yup.object({
    prodName: Yup.string().required('name field is required'),
    price: Yup.number().required('price field is required').min(1, 'price must be greater than zero'),
    des: Yup.string().required('description field is required'),
    imageUrl: Yup.string().required('image url field is required'),
    typeOfItem: Yup.string().required('type of item required')
  })

  useEffect(() => {
    getAllCategories('/api/category-list').then((res) => {
      // console.log(res.data);
      if (res && res.data) {
        setCategoryObj((state) => {
          return {
            ...state,
            categoryArray: res.data.categoryList
          }
        })
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: '/admin/productform' } })
      } else if (error && error === 'already cleared out') {
        toast.info(error)
      }
    })
  }, [activeCategoryArray, navigate])

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-lg-4' />
        <div className='col-lg-5 border p-4 shadow'>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {(formik) => {
              const handleCategory = (event) => {
                const { target } = event
                const { checked, value } = target
                const modified = [...categoryArray]
                modified.forEach((c) => {
                  if (c.catName === value) {
                    c.ischecked = checked
                  }
                })
                formik.values.categories = modified
                console.log(checked)
                console.log(value)
              }

              const handleTypeOfItem = async (event) => {
                formik.values.typeOfItem = event.target.value
              }

              return (
                <Form>
                  <div className='form-group mb-3'>
                    <label htmlFor='prodName'>Name</label>
                    <Field name='prodName'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='text' id='prodName' {...field} />
                            {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-3'>
                    <label htmlFor='price'>Price</label>
                    <Field name='price'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='number' id='price' {...field} />
                            {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-3'>
                    <label htmlFor='priceId'>PriceId</label>
                    <Field name='priceId'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='text' id='priceId' {...field} />
                            {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-3'>
                    <label htmlFor='coupon'>Coupon</label>
                    <Field name='coupon'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='number' id='coupon' {...field} />
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-3'>
                    <label htmlFor='stockQty'>StockQty</label>
                    <Field name='stockQty'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='number' id='stockQty' {...field} />
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-3'>
                    <label htmlFor='des'>Description</label>
                    <Field name='des'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <textarea className='form-control' type='text' id='des' {...field} rows='5' />
                            {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-4'>
                    <label htmlFor='imageUrl'>ImageUrl</label>
                    <Field name='imageUrl'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='text' id='imageUrl' {...field} />
                            {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-4'>
                    <label className='me-2' htmlFor='typeOfItem'>TypeOfItem :</label>
                    <Field name='typeOfItem'>
                      {(props) => {
                        const { field, meta } = props
                        const arr = ['select', 'regular', 'subscription']

                        return (
                          <>
                            <select onChange={(e) => handleTypeOfItem(e)} id='typeOfItem'>
                              {arr.map((t, i) => {
                                return (
                                  <option key={i} value={t}>{t}</option>
                                )
                              })}
                            </select>
                            {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-check mb-3'>
                    {categoryArray.map((cat, i) => {
                      return (
                        <div key={i}>
                          <input className='form-check-input me-2' type='checkbox' id={cat.catName} defaultChecked={cat.ischecked} onChange={(e) => handleCategory(e)} value={cat.catName} />
                          <label htmlFor={cat.catName}>{cat.catName}</label>
                        </div>
                      )
                    })}
                  </div>
                  <div className='text-center'>
                    <button className='btn btn-primary rounded-0 shadow px-3 fw-semibold' type='submit'>Submit</button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
        <div className='col-lg-3' />
      </div>
    </div>
  )
}

/* eslint-enable no-unused-vars */

export default ProductFormData

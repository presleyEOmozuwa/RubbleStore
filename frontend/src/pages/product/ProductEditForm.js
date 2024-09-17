/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import './Product.css'
import { getProduct, getProductWithCategories, updateProduct } from '../../services/product.service'
import { toast } from 'react-toastify'

const ProductEditForm = () => {
  const [product, setProduct] = useState({ id: '', prodName: '', price: 0, coupon: 0, newPrice: 0, priceId: '', imageUrl: '', quantity: 0, typeOfItem: '', des: '' })

  const [categoryObj, setCategoryObj] = useState({ categoryGroup: [] })

  const { categoryGroup } = categoryObj

  const activeCategoryGroup = JSON.stringify(categoryGroup)

  const { id, prodName, price, priceId, coupon, imageUrl, stockQty, typeOfItem, des } = product

  const params = useParams()
  const { productId } = params

  const navigate = useNavigate()

  const initialValues =
    {
      id,
      prodName,
      price,
      priceId,
      coupon,
      stockQty,
      des,
      imageUrl,
      typeOfItem,
      categories: [...categoryGroup]
    }

  const onSubmit = async (values, onSubmitProps) => {
    console.log(values)
    updateProduct('/api/update/product', { payload: values }).then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'product updated successfully') {
        onSubmitProps.resetForm()
        res.data.typeOfItem === 'regular' ? navigate('/admin/productlist') : navigate('/admin/sub/products')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { from: `/admin/product/update/${productId}` } })
      }
    })
  }

  useEffect(() => {
    getProduct(`/api/product-details/${productId}`).then((res) => {
      if (res && res.data.product) {
        setProduct((state) => {
          const data = res.data.product
          const clone = {
            ...state,
            id: data._id,
            prodName: data.prodName,
            price: data.price,
            coupon: data.coupon,
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
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: `/admin/product/update/${productId}` } })
      }
    })
  }, [productId, navigate])

  useEffect(() => {
    getProductWithCategories(`/api/product/with/categories/${productId}`).then((res) => {
      console.log(res.data)
      if (res && res.data.categories) {
        setCategoryObj((state) => {
          const clone = {
            ...state,
            categoryGroup: res.data.categories
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
        navigate('/login', { state: { admin: `/admin/product/update/${productId}` } })
      }
    })
  }, [activeCategoryGroup, productId, navigate])

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-lg-4' />
        <div className='col-lg-5 border p-4 shadow'>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(formik) => {
              const handleCategory = (event) => {
                const { target } = event
                const { checked, value } = target
                const modified = [...categoryGroup]
                modified.forEach((c) => {
                  if (c.catName === value) {
                    c.ischecked = checked
                  }
                })
                formik.values.categories = modified
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
                            <input className='form-control' type='text' id='prodName' value={prodName} {...field} />
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
                            <input className='form-control' type='number' id='price' value={price} {...field} />
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
                            <input className='form-control' type='text' id='priceId' value={priceId} {...field} />
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
                            <input className='form-control' type='number' id='coupon' value={coupon} {...field} />
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
                            <input className='form-control' type='number' id='stockQty' value={stockQty} {...field} />
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
                            <input className='form-control' type='text' id='des' value={des} {...field} />
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-group mb-3'>
                    <label htmlFor='imageUrl'>ImageUrl</label>
                    <Field name='imageUrl'>
                      {(props) => {
                        const { field, meta } = props
                        return (
                          <>
                            <input className='form-control' type='text' id='imageUrl' value={imageUrl} {...field} />
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
                                  <React.Fragment key={i}>
                                    {t === typeOfItem ? <option value={t} selected>{t}</option> : <option value={t}>{t}</option>}
                                  </React.Fragment>
                                )
                              })}
                            </select>
                          </>
                        )
                      }}
                    </Field>
                  </div>
                  <div className='form-check mb-3'>
                    {categoryGroup.map((cat, i) => {
                      return (
                        <div key={i}>
                          <input className='form-check-input me-2' type='checkbox' id={cat.catName} defaultChecked={cat.ischecked} onChange={(e) => handleCategory(e)} value={cat.catName} />
                          <label htmlFor={cat.catName}>{cat.catName}</label>
                        </div>
                      )
                    })}
                  </div>
                  <div className='text-center'>
                    <button className='btn btn-primary rounded-0 shadow px-3 fw-semibold' type='submit'>Update</button>
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

export default ProductEditForm

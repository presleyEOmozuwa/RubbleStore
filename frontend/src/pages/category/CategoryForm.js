import React from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import './Category.css'
import { createCategory } from '../../services/category.service'
import { toast } from 'react-toastify'

const CategoryForm = () => {
  const initialValues = {
    catName: '',
    description: ''
  }

  const navigate = useNavigate()

  // REQUEST TO SUBMIT CATEGORY DATA TO SERVER
  const onSubmit = async (payload, onSubmitProps) => {
    createCategory('/api/create/category', { payload }).then((res) => {
      if (res && res.data.status === 'category created successfully') {
        console.log(res.data.category)
        onSubmitProps.resetForm()
        navigate('/admin/categorylist')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: '/admin/categoryform' } })
      }
    })
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-4' />
        <div className='col-sm-4 border p-4 shadow-lg mt-5'>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {
                            (formik) => {
                              return (
                                <Form>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='catName'>Category Name</label>
                                    <Field name='catName'>
                                      {
                                                    (props) => {
                                                      const { field } = props

                                                      return (
                                                        <div>
                                                          <input className='form-control rounded-0' id='catName' {...field} type='text' />
                                                        </div>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='description'>Description</label>
                                    <Field name='description'>
                                      {
                                                    (props) => {
                                                      const { field } = props

                                                      return (
                                                        <div>
                                                          <textarea className='form-control rounded-0' id='description' type='text' {...field} />
                                                        </div>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='text-center'>
                                    <button className='btn btn-primary rounded-0 shadow px-3 fw-bold' type='submit'>Submit</button>
                                  </div>
                                </Form>
                              )
                            }
                        }
          </Formik>
        </div>
        <div className='col-sm-4' />
      </div>
    </div>
  )
}

export default CategoryForm

import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import './User.css'
import { getUser, updateUser } from '../../services/user.service'
import { toast } from 'react-toastify'

const UserEditForm = () => {
  const [appuser, setUser] = useState({
    username: '',
    email: ''
  })
  const { username, email } = appuser

  const navigate = useNavigate()

  const initialValues = {
    username,
    email
  }

  // REQUEST TO UPDATE A USER (BUTTON CLICK SUBMISSION)
  const onSubmit = async (payload) => {
    console.log(payload)
    updateUser('/api/update/user', { payload }).then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'user updated successfully') {
        navigate('/auth/user')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login')
      }
    })
  }

  // REQUEST TO GET A USER
  useEffect(() => {
    getUser('/api/user').then((res) => {
      setUser((state) => {
        const user = res.data.user
        const clone = {
          ...state,
          username: user.username,
          email: user.email
        }
        return clone
      })
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login')
      }
    })
  }, [navigate])

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-sm-4' />
        <div className='col-sm-4 border p-4 shadow-lg mt-2'>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {
                            (formik) => {
                              return (
                                <Form>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='username'>User Name</label>
                                    <Field name='username'>
                                      {
                                                    (props) => {
                                                      const { field } = props

                                                      return (
                                                        <div>
                                                          <input className='form-control rounded-0' id='username' {...field} type='text' />
                                                        </div>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='email'>Email</label>
                                    <Field name='email'>
                                      {
                                                    (props) => {
                                                      const { field } = props

                                                      return (
                                                        <div>
                                                          <input className='form-control rounded-0' id='email' {...field} type='text' />
                                                        </div>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='text-center'>
                                    <button className='btn btn-primary rounded-0 shadow px-3 fw-bold' type='submit'>Update</button>
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

export default UserEditForm

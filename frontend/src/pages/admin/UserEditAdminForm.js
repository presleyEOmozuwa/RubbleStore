import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import './Admin.css'
import { getUserByAdmin, updateUserByAdmin, clearHandler } from '../../services/admin.service'
import { toast } from 'react-toastify'

const UserEditAdminForm = () => {
  const [appuser, setUser] = useState({
    username: '',
    email: ''
  })
  const { username, email } = appuser

  const params = useParams()
  const { userId } = params

  const navigate = useNavigate()

  const initialValues = {
    username,
    email
  }

  // REQUEST TO UPDATE A USER (BUTTON CLICK SUBMISSION)
  const onSubmit = async (values) => {
    const payload = {
      userId,
      username: values.username,
      email: values.email
    }
    console.log(payload)

    updateUserByAdmin('/api/admin/user-update', { payload }).then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'user updated successfully') {
        navigate('/admin/userlist')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: `/admin/user/update/${userId}` } })
      }
    })
  }

  const handleClearOrders = (event) => {
    event.preventDefault()
    clearHandler(`/api/admin/clear-orders/${userId}`).then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'orders cleared from archive') {
        toast.info(res.data.status)
        navigate('/admin/userlist')
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: `/admin/user/update/${userId}` } })
      }
    })
  }

  // REQUEST TO GET A USER
  useEffect(() => {
    getUserByAdmin(`/api/admin/get-user/${userId}`).then((res) => {
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
        navigate('/login', { state: { admin: `/admin/user/update/${userId}` } })
      }
    })
  }, [userId, navigate])

  return (
    <div className='container mt-5'>
      <div className='row mb-3'>
        <div className='col-lg-4' />
        <div className='col-lg-5' />
        <div className='col-lg-3'>
          <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' onClick={(e) => handleClearOrders(e)}> Clear archived orders </button>
        </div>
      </div>
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

export default UserEditAdminForm

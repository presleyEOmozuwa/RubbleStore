import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { userNameHandler, getUser } from '../../services/user.service'
import { toast } from 'react-toastify'

const UserNameUpdate = () => {
  const [appuser, setUser] = useState({
    userId: '',
    username: ''
  })

  const { username } = appuser

  const navigate = useNavigate()

  const initialValues =
    {
      username,
      isDone: true
    }

  // REQUEST TO RETRIEVE A USER
  useEffect(() => {
    getUser('/api/user').then((res) => {
      console.log(res.data)
      if (res && res.data.user) {
        setUser((state) => {
          const user = res?.data?.user
          const clone = {
            ...state,
            userId: user._id,
            username: user?.username,
            email: user.email
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
        navigate('/login')
      }
    })
  }, [navigate])

  // REQUEST TO SUBMIT USER DATA TO THE SERVER
  const onSubmit = async (values, onSubmitProps) => {
    const payload = {
      username: values.username
    }
    console.log(payload)

    userNameHandler('/api/username/update', { payload }).then((res) => {
      console.log(res.data.status)
      if (res && res.data.status === 'username updated successfully') {
        onSubmitProps.resetForm()
        navigate('/auth/user/shared/update')
      }
    }
    ).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { from: '/auth/user/username/update' } })
      }
    })
  }

  const validationSchema = Yup.object({
    username: Yup.string().required('username field is required').min(6, 'username must be minimum of 6 characters').max(30, 'username must be maximum of 30 characters')
  })

  return (
    <div className='container mt-4'>
      <div className='row'>
        <div className='col-lg-3' />
        <div className='col-lg-6'>
          <p className='display-6'>Change UserName</p>
        </div>
        <div className='col-lg-3' />
      </div>
      <div className='row mb-3'>
        <div className='col-lg-3' />
        <div className='col-lg-6'>
          <p>
            If you want to change the name associated with your <span className='fw-bold'>Rubbles customer account</span>, you may do so below. Be sure to click the <span className='fw-bold'>Update button</span> when you are done.
          </p>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {(formik) => {
              return (
                <Form>
                  <div className='form-group'>
                    <label htmlFor='username'>User Name</label>
                    <Field name='username'>
                      {
                                                (props) => {
                                                  const { field, meta } = props

                                                  return (
                                                    <>
                                                      <input className='form-control rounded-0' id='username' type='text' value={username} {...field} />
                                                      {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                  )
                                                }
                                            }
                    </Field>
                  </div>
                  <div className='d-grid gap-2 col-6 mt-4'>
                    <button className='btn btn-primary' type='submit'> Update </button>
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

export default UserNameUpdate

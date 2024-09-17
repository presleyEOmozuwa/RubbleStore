import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { emailHandler, getUser } from '../../services/user.service'
import { emailChecker } from './user-helper'
import { toast } from 'react-toastify'

const EmailUpdate = () => {
  const [appuser, setUser] = useState({
    userId: '',
    email: ''
  })

  const { email } = appuser

  const navigate = useNavigate()

  const initialValues =
    {
      email,
      isDone: true
    }

  // REQUEST TO SUBMIT USER DATA TO THE SERVER
  const onSubmit = async (values) => {
    const payload = {
      email: values.email,
      isDone: true
    }
    console.log(payload)

    emailHandler('/api/email/update', { payload }).then((res) => {
      console.log(res.data.status)
      if (res && res.data.status === 'email updated successfully') {
        navigate('/auth/user/shared/update')
      }
    }
    ).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { from: '/auth/user/email/update' } })
      } else if (error && error === 'you cannot use an old email, provide a new one') {
        toast.info(error)
      }
    })
  }

  const validationSchema = Yup.object({
    email: Yup.string().required('email field is required').email('invalid email format')
  })

  // REQUEST TO RETRIEVE A USER
  useEffect(() => {
    getUser('/api/user').then((res) => {
      console.log(res.data)
      if (res && res.data.user) {
        setUser((state) => {
          const user = res.data.user
          const clone = {
            ...state,
            userId: user._id,
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
        navigate('/login', { state: { auth: '/auth/user/email/update' } })
      } else if (error && error === 'provide a new email address') {
        toast.info(error)
      } else if (error && error === 'you cannot use an old email, provide a new one') {
        toast.info(error)
      }
    })
  }, [navigate])

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-4' />
        <div className='col-lg-5'>
          <p className='display-6'>Change your Email</p>
          <div>
            <p className='m-0 fw-semibold'> Current email address: </p>
            <span className='text-success'>{email}</span>
            <p className='mt-3'>
              Enter the new email address you would like to associate with your account below.
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
                      <label htmlFor='email'> Enter new email </label>
                      <Field name='email'>
                        {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='email' type='email' value={email} {...field} />
                                                          {emailChecker(formik.values.email, email, meta)
                                                            ? <p className='text-danger'>
                                                              you cannot use the email address you've entered, because it is the same as your current email address.
                                                              </p>
                                                            : null}
                                                          {/* {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null} */}
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
        </div>
        <div className='col-lg-3' />
      </div>
    </div>
  )
}

export default EmailUpdate

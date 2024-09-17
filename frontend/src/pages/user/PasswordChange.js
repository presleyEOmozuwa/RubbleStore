import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { passwordChangeHandler } from '../../services/user.service'

const PasswordChange = () => {
  const navigate = useNavigate()

  const initialValues =
    {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

  // REQUEST TO SUBMIT USER DATA TO THE SERVER
  const onSubmit = async (values, onSubmitProps) => {
    const payload = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    }
    passwordChangeHandler('/api/passwordchange/update', { payload }).then((res) => {
      console.log(res.data.status)
      if (res && res.data.status === 'password changed successfully') {
        onSubmitProps.resetForm()
        toast.info(res.data.status)
        navigate('/auth/user/shared/update')
      }
    }
    ).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { auth: '/auth/user/passwordchange/update' } })
      } else if (error && error === 'old password is invalid') {
        toast.info(error)
      }
    })
  }

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required('old password field is required'),
    newPassword: Yup.string().required('password field is required').min(8, 'password must be minimum of 8 characters').max(10, 'password must be maximum of 15 charaters'),
    confirmPassword: Yup.string().required('confirm password field is required').oneOf([Yup.ref('newPassword'), ''], 'password do not match')
  })

  return (
    <div className='container-fluid pt-4 vh-100 register-section '>
      <div className='text-center'>
        <h2 className=''>Change your password</h2>
      </div>
      <div className='row'>
        <div className='col-sm-4' />
        <div className='col-sm-4 border p-4 shadow-lg mt-2 bg-white'>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {
                            (formik) => {
                              return (
                                <Form>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='oldPassword'>Old Password</label>
                                    <Field name='oldPassword'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='oldPassword' {...field} type='password' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                          <p>{formik.values.oldPassword}</p>
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='newPassword'>New Password</label>
                                    <Field name='newPassword'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='newPassword' {...field} type='password' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                          <p>{formik.values.newPassword}</p>
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='confirmPassword'>Confirm New Password</label>
                                    <Field name='confirmPassword'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='confirmPassword' {...field} type='password' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                          <p>{formik.values.confirmPassword}</p>
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='d-grid gap-2 col-6 mx-auto mt-4'>
                                    <button className='btn btn-primary' type='submit'> Update </button>
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

export default PasswordChange

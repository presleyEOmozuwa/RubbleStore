import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { passwordChangeHandler } from '../../services/user.service'

const ResetPasswordForm = () => {
  const params = useParams()
  const { token } = params

  const initialValues =
    {
      password: '',
      confirmPassword: ''
    }

  const navigate = useNavigate()

  // REQUEST TO SUBMIT USER DATA TO THE SERVER
  const onSubmit = async (values, onSubmitProps) => {
    const payload = {
      token,
      password: values.password
    }
    console.log(payload)
    passwordChangeHandler('/api/reset-password/payload', { payload }).then((res) => {
      console.log(res.data.status)
      if (res && res.data.status === 'password reset successful') {
        onSubmitProps.resetForm()
        toast.info(res.data.status)
        navigate('/login')
      }
    }
    ).catch((err) => {
      if (err.response) {
        const { error } = err.response.data
        console.log(error)
      }
    })
  }

  const validationSchema = Yup.object({
    password: Yup.string().required('password field is required').min(8, 'password must be minimum of 8 characters').max(10, 'password must be maximum of 15 charaters'),
    confirmPassword: Yup.string().required('confirm password field is required').oneOf([Yup.ref('password'), ''], 'password do not match')
  })

  return (
    <div className='container-fluid pt-4 vh-100 register-section'>
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
                                    <label htmlFor='password'>New Password</label>
                                    <Field name='password'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='password' {...field} type='password' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='confirmPassword'>Confirm Password</label>
                                    <Field name='confirmPassword'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='confirmPassword' {...field} type='password' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='text-center'>
                                    <button className='btn btn-primary rounded-0 shadow px-3 fw-bold' type='submit'> Submit </button>
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

export default ResetPasswordForm

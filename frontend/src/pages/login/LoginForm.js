/* eslint-disable no-unused-vars */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Login.css'
import * as Yup from 'yup'
import { useAuth } from '../../context/AuthContext'
import GoogleSignin from './GoogleSignin'
import { toast } from 'react-toastify'
import { loginUser } from '../../services/user.service'

const LoginForm = () => {
  const initialValues = {
    email: '',
    password: '',
    rememberMe: '',
    useToken: ''
  }

  // let [error, setError] = useState(false);

  const auth = useAuth()
  const { login } = auth

  const navigate = useNavigate()
  // const loc = useLocation()

  const validationSchema = Yup.object({
    email: Yup.string().required('email field is required').email('invalid email format'),
    password: Yup.string().required('password field is required')
  })

  // REQUEST TO AUTHENTICATE WITH THE SERVER
  const onSubmit = async (values, onSubmitProps) => {
    console.log(values)
    loginUser('/api/login/payload', values).then(async (res) => {
      if (res && res?.data.status === 'login successful') {
        onSubmitProps.resetForm()
        login(res?.data?.user)

        const { role } = res?.data?.user

        if (role === 'admin') {
          return navigate('/admin/system', { replace: true })
        } else if (role === 'client') {
          return navigate('/auth/user', { state: { from: res?.data.user.email }, replace: true })
        } else {
          return navigate('/', { state: { from: res.data?.user.email }, replace: true })
        }
      } else if (res && res.data.status === 'otp sent to user') {
        return navigate(`/otp/2fa/${res.data.userId}`, { state: { from: res.data.hash } })
      }
    }).catch((err) => {
      if (err && err.response) {
        const { error } = err.response.data
        if (error === 'email and password fields are required') {
          // onSubmitProps.resetForm();
          toast.info(error)
        }
        if (error === 'email is associated to a closed account') {
          // onSubmitProps.resetForm();
          toast.info(error)
        }
        if (error === 'email is associated to a blocked account') {
          // onSubmitProps.resetForm();
          toast.info('your account has been blocked, call customer support for help.', { autoClose: 6000 })
        }
        if (error === 'invalid email or password') {
          // onSubmitProps.resetForm();
          toast.info(error)
        }
      }
    })
  }

  return (
    <div className='container-fluid mx-auto p-2 login-section'>
      <div className='container p-3 mb-3' style={{ minHeight: '200px' }}>
        <div className='row mx-auto' style={{ minHeight: '200px' }}>
          <div className='col-lg-3' />
          <div className='col-lg-6 mx-auto bg-white border p-4 shadow'>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => {
                const handleRememberMe = (event) => {
                  const { target } = event
                  const { checked, value } = target
                  if (checked) {
                    formik.values.rememberMe = value
                  }
                }

                const handleUseToken = (event) => {
                  const { target } = event
                  const { checked, value } = target
                  if (checked) {
                    formik.values.useToken = value
                  }
                }

                return (
                  <Form>
                    <div className='form-group mb-3'>
                      <label className='me-5' htmlFor='email'>Email</label>
                      <Field name='email'>
                        {
                                                    (props) => {
                                                      const { field, meta } = props
                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0 border-2' id='email' {...field} type='email' noValidate />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                      </Field>
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor='password'>Password</label>
                      <Field name='password'>
                        {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0 border-2' id='password' {...field} type='password' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                      </Field>
                    </div>
                    <div className='row mb-2'>
                      <div className='col-lg-6'>
                        <Field>
                          {(props) => {
                            return (
                              <input className='form-check-input m-1 rounded-0 border-dark' type='checkbox' value='remember me' onChange={(e) => handleRememberMe(e)} id='remember me' />
                            )
                          }}

                        </Field>
                        <label htmlFor='remember me'>Remember me</label>
                      </div>
                      <div className='col-lg-6'>
                        <Field>
                          {(props) => {
                            return (
                              <input className='form-check-input m-1 rounded-0 border-dark' id='use token' type='checkbox' value='use token' onChange={(e) => handleUseToken(e)} />
                            )
                          }}
                        </Field>
                        <label htmlFor='use token'>Use token</label>
                      </div>
                    </div>
                    <div className='mb-3'>
                      <Link to='/forgot/password'>forgot password?</Link>
                    </div>
                    <div className='d-grid gap-2 mb-3'>
                      <button className='btn btn-primary rounded-0 fw-semibold' type='submit'>Login</button>
                    </div>
                    <div className='mb-3'>
                      <GoogleSignin />
                    </div>
                    <div>
                      <p>Don't have an account? <Link to='/register'>Register Here</Link></p>
                    </div>
                  </Form>
                )
              }}
            </Formik>

          </div>
          <div className='col-lg-3' />
        </div>
      </div>
    </div>
  )
}

/* eslint-enable no-unused-vars */

export default LoginForm

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import './Register.css'
import { toast } from 'react-toastify'
import { registerAdminUser, registerUser } from '../../services/user.service'

const RegisterForm = () => {
  const initialValues =
    {
      username: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      terms: false,
      privacy: false
    }

  const navigate = useNavigate()

  // REQUEST TO SUBMIT USER DATA TO THE SERVER
  const onSubmit = async (values, onSubmitProps) => {
    const payload = {
      username: values.username,
      email: values.email,
      password: values.password,
      terms: values.terms,
      privacy: values.privacy
    }
    console.log(payload)

    if (payload.email === process.env.REACT_APP_ADMIN_EMAIL) {
      registerAdminUser('/api/register/admin', { payload }).then((res) => {
        console.log(res)
        onSubmitProps.resetForm()
        navigate('/login')
      }
      ).catch((err) => {
        if (err.response.data) {
          const { error } = err.response.data
          console.log(error)
        }
      })
    } else {
      registerUser('/api/register', { payload }).then((res) => {
        console.log(res.data.isRegistered)
        if (res && res.data.isRegistered) {
          onSubmitProps.resetForm()
          toast.info('Check your inbox for account activation link. It expires in 10mins.', { autoClose: false })
        }
      }
      ).catch((err) => {
        if (err.response) {
          const { error } = err.response.data
          console.log(error)
          if (error === 'email already in use') {
            toast.info(error, { autoClose: 5000, position: 'top-center' })
          }

          if (error === 'email cannot be used, account closed') {
            toast.info('email already used', { autoClose: 5000, position: 'top-center' })
          }
        }
      })
    }
  }

  const validationSchema = Yup.object({
    username: Yup.string().required('username field is required').min(6, 'username must be minimum of 6 characters').max(30, 'username must be maximum of 30 characters'),
    email: Yup.string().required('email field is required').email('invalid email format'),
    confirmEmail: Yup.string().required('confirm email field is required').oneOf([Yup.ref('email'), ''], 'email do not match'),
    password: Yup.string().required('password field is required').min(8, 'password must be minimum of 8 characters').max(10, 'password must be maximum of 15 charaters'),
    confirmPassword: Yup.string().required('confirm password field is required').oneOf([Yup.ref('password'), ''], 'password do not match'),
    terms: Yup.boolean().required('Required').oneOf([true], 'you should accept the terms of use.'),
    privacy: Yup.boolean().required('Required').oneOf([true], 'you should accept the terms of privacy.')
  })

  return (
    <div className='container-fluid pt-4 register-section'>
      <div className='row'>
        <div className='col-sm-3' />
        <div className='col-sm-5 border p-4 shadow-lg mt-2 bg-white mx-3'>
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
                                    <label data-testid='username element' htmlFor='username'>User Name</label>
                                    <Field name='username'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='username' {...field} type='text' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
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
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='email' {...field} type='email' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='confirmEmail'>Re-Enter Email</label>
                                    <Field name='confirmEmail'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='confirmEmail' {...field} type='email' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <label htmlFor='password'>Password</label>
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
                                    <label htmlFor='confirmPassword'>Re-Enter Password</label>
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
                                  <div className='form-group sect mb-3'>
                                    <Field name='terms'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-check-input rounded-0' id='terms' {...field} type='checkbox' />
                                                          <label className='ms-2' htmlFor='terms'>I agree to the Terms of Use.</label>
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='form-group sect mb-3'>
                                    <Field name='privacy'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props

                                                      return (
                                                        <>
                                                          <input className='form-check-input rounded-0' id='privacy' {...field} type='checkbox' />
                                                          <label className='ms-2' htmlFor='privacy'>I accept the Privacy Policy.</label>
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <p>Please review the <Link to='#'> Terms of Use </Link> and <Link to='#'> Privacy Policy </Link></p>
                                  <div className='text-center'>
                                    <button className='btn btn-primary rounded-0 shadow p-0 py-2 px-5 fw-bold' type='submit'>Register</button>
                                  </div>
                                </Form>
                              )
                            }
                        }
          </Formik>
          <div className='mt-2 text-center'>
            <span className='fw-bold'> Have an account? </span><Link className='fw-bold' to='/login'> Login here </Link>
          </div>
        </div>
        <div className='col-sm-4' />
      </div>
    </div>
  )
}

export default RegisterForm

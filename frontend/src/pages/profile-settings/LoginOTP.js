import React from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import { useAuth } from '../../context/AuthContext'
import { OTPHandler } from '../../services/user.service'
import { toast } from 'react-toastify'

const LoginOTP = () => {
  const initialValues = {
    code: ''
  }

  const auth = useAuth()
  const { login } = auth

  const params = useParams()
  const { userId } = params

  const navigate = useNavigate()
  const loc = useLocation()

  const validationSchema = Yup.object({
    code: Yup.string().required('verification code field is required')
  })

  // REQUEST TO AUTHENTICATE WITH THE SERVER
  const onSubmit = async (values, onSubmitProps) => {
    const payload = {
      code: values.code,
      userId,
      hashed: loc.state?.from
    }
    console.log(payload)

    OTPHandler('/api/otp-code', { payload }).then((res) => {
      if (res && res?.data.status === 'login successful') {
        onSubmitProps.resetForm()

        login(res.data.user)

        const { role } = res.data.user

        if (role === 'admin') {
          navigate('/admin/system', { replace: true })
        } else if (role === 'client') {
          navigate('/auth/user', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      }
    }).catch((err) => {
      if (err && err.response) {
        const { error } = err.response.data
        console.log(error)

        if (error) {
          toast.info(error)
          onSubmitProps.resetForm()
        }
      }
    })
  }

  return (
    <div className='container-fluid pt-5 mx-auto vh-100 login-section'>
      <div className='row'>
        <div className='col-lg-4' />
        <div className='col-lg-5 border p-4 bg-white shadow-lg mt-2'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {
                            (formik) => {
                              return (
                                <Form>
                                  <div className='form-group sect mb-3'>
                                    <label className='me-5 fs-4' htmlFor='code'>Verification code</label>
                                    <p className='m-0 ms-1 text-success fw-semibold'>check your inbox for one time password,<br /> it expires in 5mins.</p>
                                    <Field name='code'>
                                      {
                                                    (props) => {
                                                      const { field, meta } = props
                                                      return (
                                                        <>
                                                          <input className='form-control rounded-0' id='code' {...field} type='text' />
                                                          {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                        </>
                                                      )
                                                    }
                                                }
                                    </Field>
                                  </div>
                                  <div className='text-center mt-3'>
                                    <button className='btn btn-primary rounded-0 shadow px-5 fw-bold' type='submit'>Verify</button>
                                  </div>
                                </Form>
                              )
                            }
                        }
          </Formik>
        </div>
        <div className='col-lg-3' />
      </div>
    </div>
  )
}

export default LoginOTP

import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { forgotPasswordHandler } from '../../services/user.service'
import { toast } from 'react-toastify'
import './ProfileSettings.css'

const ForgotPasswordForm = () => {
  const initialValues = {
    email: ''
  }

  const onSubmit = async (values, onSubmitProps) => {
    console.log(values.email)
    forgotPasswordHandler('/api/forgot-password/payload', { email: values.email }).then((res) => {
      if (res && res.data.status === 'reset password link sent to inbox') {
        console.log(res.data)
        onSubmitProps.resetForm()
        toast.info('Check your inbox for reset password link. It expires in 10 mins.', { autoClose: false })
      }
    }).catch((err) => {
      if (err.response) {
        const { error } = err.response.data
        if (error === 'user not found') {
          toast.info('invalid email address')
        }
      }
    })
  }

  const validationSchema = Yup.object({
    email: Yup.string().required('email field is required').email('invalid email format')
  })

  return (
    <div className='container-fluid pt-5'>
      <div className='row'>
        <div className='col-lg-3' />
        <div className='col-lg-6 border shadow p-5 pt-4'>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {(formik) => {
              return (
                <Form>
                  <div className='text-center mb-2'>
                    <p className='display-6'>Password Reset</p>
                  </div>
                  <div className='form-group sect mb-3'>
                    <label className='me-5' htmlFor='email'>EmailAddress</label>
                    <Field name='email'>
                      {
                                                (props) => {
                                                  const { field, meta } = props
                                                  return (
                                                    <div>
                                                      <input className='form-control rounded-0' id='email' {...field} type='email' placeholder='Enter Email' noValidate />
                                                      {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </div>
                                                  )
                                                }
                                            }
                    </Field>
                  </div>
                  <div className='d-grid gap-2 col-9 mx-auto'>
                    <button className='btn btn-primary' type='submit'> Submit </button>
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

export default ForgotPasswordForm

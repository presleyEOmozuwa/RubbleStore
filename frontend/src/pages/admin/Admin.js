import React from 'react'
import './Admin.css'

const Admin = () => {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-4' />
        <div className='col-lg-4 admin w-100 bg-primary'>
          <p className='display-5 text-center text-white p-5'> Administrator </p>
        </div>
        <div className='col-lg-4 takeTwo' />
      </div>
    </div>
  )
}

export default Admin

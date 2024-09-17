import React from 'react'

const NoMatch = () => {
  return (
    <div className='container-fluid mt-4'>
      <div className='row'>
        <div className='col-sm-3' />
        <div className='col-sm-6 text-center border p-5 mt-5 bg-primary text-white'>
          <span data-testid='not found' className='display-5'>Page Not Found</span>
        </div>
        <div className='col-sm-3' />
      </div>
    </div>
  )
}

export default NoMatch

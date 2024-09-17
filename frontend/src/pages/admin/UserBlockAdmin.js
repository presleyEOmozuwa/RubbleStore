import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { blockHandler, unblockHandler } from '../../services/admin.service'
import { toast } from 'react-toastify'

const UserBlockAdmin = () => {
  // ID OF THE USER ADMIN WANTS TO BLOCK
  const { userId } = useParams()

  const navigate = useNavigate()

  const handleBlock = () => {
    blockHandler(`/api/admin/user-block/${userId}`).then((res) => {
      if (res && res.data.blocked === 'user successfully blocked') {
        toast.info(res.data.blocked, { autoClose: 3000 })
        setTimeout(() => {
          navigate('/admin/userlist')
        }, 3000)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: `/admin/user/block/${userId}` } })
      }
    })
  }

  const handleUnblock = () => {
    unblockHandler(`/api/admin/user-unblock/${userId}`).then((res) => {
      if (res && res.data.unblocked === 'user successfully unblocked') {
        toast.info(res.data.unblocked, { autoClose: 3000 })
        setTimeout(() => {
          navigate('/admin/userlist')
        }, 3000)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: `/admin/user/block/${userId}` } })
      }
    })
  }

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-lg-2' />
        <div className='col-lg-8 border text-center shadow p-3'>
          <p className='display-6 m-0'> Block user </p>
          <p className='p-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eumLorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eumLorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
          <div>
            <div className='text-center'>
              <button className='btn btn-danger rounded-0 shadow p-0 px-4 py-1  m-2' type='submit' onClick={(e) => handleBlock(e)}>Block</button>
              <button className='btn btn-primary rounded-0 shadow p-0 px-4 py-1' type='submit' onClick={(e) => handleUnblock(e)}>Unblock</button>
            </div>
          </div>
        </div>
        <div className='col-lg-2' />
      </div>
    </div>
  )
}

export default UserBlockAdmin

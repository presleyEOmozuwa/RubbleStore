/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './User.css'
import { getAllUsers } from '../../services/user.service'
import { deleteUserByAdmin, clearHandler, clearOrderArchive, locationHandler } from '../../services/admin.service'
import { toast } from 'react-toastify'

const UserList = () => {
  const [userObj, setUsers] = useState({ users: [] })
  const { users } = userObj
  const activeUsers = JSON.stringify(users)

  const [page, setPage] = useState(0)
  const [count, setCount] = useState(4)

  const [searchVal, setSearchVal] = useState('')

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchVal) || user.username.toLowerCase().includes(searchVal))

  const finalUsers = filteredUsers.filter((user) => user.email !== process.env.REACT_APP_ADMIN_EMAIL)

  const [deletedUser, setDeletedUser] = useState({})

  const navigate = useNavigate()

  const handlePrevious = async (event) => {
    event.preventDefault()
    if (page >= 0) {
      return setPage((page) => page - 1)
    }
  }

  const handleNext = async (event) => {
    event.preventDefault()
    if (users.length >= 1) {
      return setPage((page) => page + 1)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    setSearchVal(event.target.value)
  }

  useEffect(() => {
    getAllUsers(`/api/users?count=${count}&page=${page}`).then((res) => {
      console.log(res.data)
      if (res && res?.data?.users) {
        setUsers((state) => {
          const clone = {
            ...state,
            users: res.data.users
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
        navigate('/login', { state: { admin: '/admin/userlist' } })
      } else if (error && error === 'already cleared out') {
        toast.info(error)
      }
    })
  }, [activeUsers, deletedUser._id, count, page, navigate])

  const handleEdit = (event) => {
    event.preventDefault()
    navigate(`/admin/user/update/${event.target.value}`)
  }

  // REQUEST TO DELETE A USER
  const handleDelete = async (event) => {
    event.preventDefault()
    if (window.confirm('are you sure you want to delete user?')) {
      deleteUserByAdmin(`/api/admin/user-delete/${event.target.value}`).then((res) => {
        console.log(res.data)
        if (res && res.data.status === 'user deleted successfully') {
          setDeletedUser(res.data.deletedUser)
        }
      }).catch(async (err) => {
        console.log(err)
        const { error } = err.response.data
        if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
          console.log(error)
          toast.info('Session expired, login to continue', { autoClose: false })
          navigate('/login', { state: { admin: '/admin/userlist' } })
        }
      })
    }
  }

  const handleDeletedUsers = (event) => {
    event.preventDefault()
    clearHandler('/api/admin/clear-deletedusers').then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'deleted users successfully removed') {
        toast.info(res.data.status)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login', { state: { admin: '/admin/userlist' } })
      } else if (error && error === 'already cleared out') {
        toast.info(error)
      }
    })
  }

  const handleClearOrders = (event) => {
    event.preventDefault()
    if (window.confirm("are you sure you want to clear out user's order archive?")) {
      clearOrderArchive(`/api/admin/clear-orders/${event.target.value}`).then((res) => {
        console.log(res.data)
        if (res && res.data.status === 'orders cleared from archive') {
          toast.info(res.data.status)
        }
      }).catch(async (err) => {
        console.log(err)
        const { error } = err.response.data
        if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
          console.log(error)
          toast.info('Session expired, login to continue', { autoClose: false })
          navigate('/login', { state: { admin: '/admin/userlist' } })
        } else if (error && error === 'nothing to delete') {
          toast.info(error)
        }
      })
    }
  }

  const handleLocation = (event) => {
    event.preventDefault()
    locationHandler('/api/admin/clear-locationusers').then((res) => {
      console.log(res.data)
      if (res && res.data.status === 'users location successfully removed') {
        toast.info(res.data.status)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login')
      } else if (error && error === 'location already cleared out') {
        toast.info(error)
      }
    })
  }

  return (
    <div className='container-fluid mt-2'>
      <div className='row'>
        <div className='col-lg-8' />
        <div className='col-lg-4 sect text-center'>
          <input className='rounded form-control' type='text' placeholder='Search Item' onChange={(e) => handleSearch(e)} />
        </div>
      </div>
      <div className='row mb-1 justify-content-center mt-2'>
        <div className='col-lg-4' />
        <div className='col-lg-5' />
        <div className='col-lg-3'>
          <div className='mb-2'>
            <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' onClick={(e) => handleDeletedUsers(e)}> Clear deleted users </button>
          </div>
        </div>
      </div>

      {/* <div className='row justify-content-center'>
                <div className='col-lg-4'></div>
                <div className='col-lg-5'></div>
                <div className='col-lg-3'>
                    <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' onClick={(e) => handleLocation(e)}> Clear location users </button>
                </div>
            </div> */}
      <div className='row justify-content-center'>
        <div className='col-sm-1' />
        <div className='col-sm-10 border mt-5'>
          <table className='table table-hover'>
            <thead>
              <tr>
                {/* <th scope="col">Id</th> */}
                <th scope='col'>UserName</th>
                <th scope='col'>Email</th>
                <th scope='col'>VerifiedEmail</th>
                <th scope='col'>Security</th>
                <th scope='col'>Blocked</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            {finalUsers.map((user, index) => {
              return (
                <tbody className='' key={index}>
                  <tr>
                    {/* <th scope="row">{user.id}</th> */}
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{(user.confirmemail)}</td>
                    <td>
                      <a href={`/admin/user/block/${user._id}`} style={{ textDecoration: 'underline' }}> Block user</a>
                    </td>
                    <td>{(user.isblocked)}</td>
                    <td>
                      <button className='btn btn-primary rounded-0 shadow p-0 px-2 m-1' type='submit' value={user._id} onClick={(e) => handleEdit(e)}>Edit</button>
                      <button className='btn btn-danger rounded-0 shadow p-0 px-2 m-1' type='submit' value={user._id} onClick={(e) => handleDelete(e)}>Del</button>
                      <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' value={user._id} onClick={(e) => handleClearOrders(e)}>Order</button>
                    </td>
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
        <div className='col-sm-1' />
      </div>
      <div className='row mb-3'>
        <div className='col-lg-4' />
        <div className='col-lg-4 text-center'>
          <button className='btn btn-white text-primary p-0 px-3 rounded-0 border me-1' onClick={(e) => handlePrevious(e)}><small> Previous </small></button>
          <button className='btn btn-white text-primary p-0 px-3 rounded-0 border ms-1' onClick={(e) => handleNext(e)}><small> Next</small></button>
        </div>
        <div className='col-lg-4' />
      </div>
    </div>
  )
}

/* eslint-enable no-unused-vars */

export default UserList

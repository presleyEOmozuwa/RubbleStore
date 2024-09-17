const express = require('express')
const router = express.Router()
const { getAllUsers, getAppUser, getUserByEmail, upDateUser, deleteUser } = require('./appuser-service')
const { saveDeletedUser } = require('../Utils/user-utils')
const { validateToken } = require('../Token/tokenValidator')

router.get('/api/app/user/:email', async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email)
    res.send({ user })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.get('/api/users', async (req, res) => {
  try {
    const { count, page } = req.query

    validateToken(req, res)
    const user = req.user
    const adminId = user.id
    const admin = await getAppUser(adminId)

    if (admin.role === 'admin') {
      const users = await getAllUsers(count, page)
      res.send({ users })
    }
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.get('/api/user', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    res.send({ user })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.put('/api/update/user', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    await upDateUser(user._id, req.body.payload)

    res.send({ status: 'user updated successfully' })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.delete('/api/delete/user', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const { removedUser } = await deleteUser(user._id)

    await saveDeletedUser(removedUser)

    res.send({ Status: 'user deleted successfully' })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

module.exports = router

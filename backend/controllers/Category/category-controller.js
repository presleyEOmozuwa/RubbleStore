const express = require('express')
const router = express.Router()
const { getCategoryList, getCategory, createCategory, deleteCategory, upDateCategory } = require('./category-service')
const { getAppUser } = require('../AppUser/appuser-service')
const { validateToken } = require('../Token/tokenValidator')

router.get('/api/category-list', async (req, res) => {
  try {
    validateToken(req, res)
    const user = req.user
    const adminId = user.id
    const admin = await getAppUser(adminId)

    if (admin.role === 'admin') {
      const categories = await getCategoryList()

      return res.send({ categoryList: categories })
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

router.get('/api/category/:categoryId', async (req, res) => {
  try {
    validateToken(req, res)
    const user = req.user
    const adminId = user.id
    const admin = await getAppUser(adminId)

    if (admin.role === 'admin') {
      const category = await getCategory(req.params.categoryId)
      res.send({ category })
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

router.post('/api/create/category', async (req, res) => {
  try {
    validateToken(req, res)
    const user = req.user
    const adminId = user.id
    const admin = await getAppUser(adminId)

    if (admin.role === 'admin') {
      await createCategory(req.body.payload)
      res.send({ status: 'category created successfully' })
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

router.put('/api/category/update', async (req, res) => {
  try {
    validateToken(req, res)
    const user = req.user
    const adminId = user.id
    const admin = await getAppUser(adminId)

    if (admin.role === 'admin') {
      await upDateCategory(req.body.payload)
      res.send({ status: 'category updated successful' })
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

router.delete('/api/delete/category/:categoryId', async (req, res) => {
  try {
    validateToken(req, res)
    const user = req.user
    const adminId = user.id
    const admin = await getAppUser(adminId)

    if (admin.role === 'admin') {
      const { deletedCategory } = await deleteCategory(req.params.categoryId)

      res.send({ status: 'category deleted successfully', deletedCategory })
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

module.exports = router

const express = require('express')
const router = express.Router()
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveOrderArchive } = require('./order-archive-service')
const { validateToken } = require('../Token/tokenValidator')

router.get('/api/order/history', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const orderArchive = await retrieveOrderArchive(user._id)
    orderArchive.orders.sort((a, b) => a - b).reverse()
    res.send({ orderArchive })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.get('/api/order-details/:sessionId', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const orderArchive = await retrieveOrderArchive(user._id)

    const order = orderArchive.orders.find((orderItem) => orderItem.checkoutSessionId === req.params.sessionId)

    if (!order) {
      throw new Error('order not found in archive')
    }

    res.send({ order })
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

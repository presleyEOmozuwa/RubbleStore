const express = require('express')
const router = express.Router()
const { createOrder } = require('./order-service')
const { getAppUser } = require('../AppUser/appuser-service')
const { multipleRegularItemsHandler } = require('../Utils/multiple-regular-item-utils')
const { singleRegularItemHandler } = require('../Utils/single-regular-items-utils')
const { addCartItemToOrder } = require('../Utils/order-utils')
const { validateToken } = require('../Token/tokenValidator')

router.post('/api/regular/multiple/create-checkout-session', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const session = await multipleRegularItemsHandler(user, req.body.cartItems)

    const order = await createOrder(user, session)

    req.body.cartItems.forEach(async (item) => {
      await addCartItemToOrder(order._id, item)
    })

    res.send({ url: session.url })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.post('/api/single/regular/create-checkout-session', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const session = await singleRegularItemHandler(user, req.body.cartItems)

    const order = await createOrder(user, session)

    req.body.cartItems.forEach(async (item) => {
      await addCartItemToOrder(order._id, item)
    })

    res.send({ url: session.url })
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

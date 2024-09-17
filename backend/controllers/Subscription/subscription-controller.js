const express = require('express')
const router = express.Router()
const { getAppUser } = require('../AppUser/appuser-service')
const { createSub } = require('./subscription-service')
const { addSubToOrder } = require('../Utils/subscription-utils')
const { itemNameChecker } = require('./helper')
const { multipleSubscriptionItemsHandler } = require('../Utils/multiple-subscription-items-utils')
const { singleSubscriptionItemHandler } = require('../Utils/single-subscription-item-utils')
const { validateToken } = require('../Token/tokenValidator')

router.post('/api/sub/multiple/create-checkout-session', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const items = await itemNameChecker(user, req.body.cartItems)

    const session = await multipleSubscriptionItemsHandler(user, items)

    const sub = await createSub(user, session)

    items.forEach(async (item) => {
      await addSubToOrder(sub._id, item)
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

router.post('/api/sub/single/create-checkout-session', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const items = await itemNameChecker(user, req.body.cartItems)

    const session = await singleSubscriptionItemHandler(user, items)

    const sub = await createSub(user, session)

    items.forEach(async (item) => {
      await addSubToOrder(sub._id, item)
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

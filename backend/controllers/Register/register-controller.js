const express = require('express')
const router = express.Router()
const { register } = require('./register-service')
const { assignCartToUser, sessionProductsHandler } = require('../Utils/cart-util')
const { assignSubCartToUser } = require('../Utils/cart-subitems-utils')
const { assignOrderArchiveToUser, assignOrderStoreToUser } = require('../Utils/order-utils')
const { refreshTokenStore } = require('../Utils/token.utils')
const { sendEmailToUser } = require('../Utils/email-utils')
const { locationTracker } = require('../Utils/user-utils')
const { assignSubscriptionToUser, assignSubArchiveToUser } = require('../Utils/subscription-utils')

router.post('/api/register', async (req, res) => {
  try {
    // REGISTERED USER RETURNED
    const createdUser = await register(req.body.payload)

    await locationTracker(createdUser, req.sessionID)

    await assignCartToUser(createdUser)

    await assignSubCartToUser(createdUser)

    await sessionProductsHandler(req.session.products, createdUser, req)

    await refreshTokenStore(createdUser)

    await assignOrderStoreToUser(createdUser)

    await assignOrderArchiveToUser(createdUser)

    await assignSubscriptionToUser(createdUser)

    await assignSubArchiveToUser(createdUser)

    await sendEmailToUser(createdUser)

    res.send({ status: 'client registration successful', isRegistered: true, sessionId: req.sessionID, user: createdUser })
  } catch (err) {
    const { message } = err
    if (message === 'please provide required fields' || message === 'inputs validation failed' || message === 'email cannot be used for registration, it is associated to a deleted account' || message === 'email already in use') {
      res.status(400).send({ error: message })
    } else {
      res.status(500).send({ error: message })
    }
  }
})

module.exports = router

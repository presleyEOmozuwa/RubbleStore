const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { getAppUser } = require('../AppUser/appuser-service')
const { updateOrder, resetOrder } = require('../Order/order-service')
const { updateOrderShippingInfo } = require('../Order/order.helper')
const { addOrderToOrderArchive } = require('../Utils/order-utils')
const { retrieveOrderArchive } = require('../Order_Archive/order-archive-service')
const { addSubToSubArchive } = require('../Utils/subscription-utils')
const { updateSub, resetSubOrder } = require('../Subscription/subscription-service')
const { retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service')
const { addItemNamesToList } = require('../Subscription_Archive/helper')
const { validateToken } = require('../Token/tokenValidator')

// CUSTOMER BILLING PORTAL
router.get('/api/stripe/customer/portal', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripecustomerid,
      return_url: process.env.PORTAL_RETURN_URL
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

// CHECKOUT SUCCESS, REGULAR ITEMS
router.get('/api/checkout/success/regular/:sessionId',
  async (req, res) => {
    try {
      validateToken(req, res)
      const userId = req.user.id
      const user = await getAppUser(userId)

      const userOrderArchive = await retrieveOrderArchive(user._id)

      const userOrder = userOrderArchive.orders.find((orderItem) => orderItem.checkoutSessionId === req.params.sessionId)

      if (userOrder && userOrder.paymentStatus === 'paid') {
        throw new Error('unecessary reload')
      }

      // update with stripe customer payment info
      const stripeOrderUpdate = await updateOrder(user, req.params.sessionId)

      // handle order update when it fails.
      if (!stripeOrderUpdate) {
        resetOrder(user)
        throw new Error('stripe order update failed')
      }

      // update with shippo shipping details
      const shippingOrderUpdate = await updateOrderShippingInfo(user, stripeOrderUpdate)

      // add order to order archive store
      await addOrderToOrderArchive(user, shippingOrderUpdate)

      // reset order store
      await resetOrder(user)

      // get order from order archive for use on client side
      const orderArchive = await retrieveOrderArchive(user._id)

      const order = orderArchive.orders.find((orderItem) => orderItem.checkoutSessionId === req.params.sessionId)

      if (!order) {
        throw new Error('order not found in archive')
      }

      res.send({ status: 'multiple checkout success order processed', order })
    } catch (err) {
      const { message } = err
      if (message === 'token not found on request' || message === 'refresh token expired') {
        res.status(401).send({ error: err.message })
        return
      }
      res.status(500).send({ error: err.message })
    }
  })

// CHECKOUT SUCCESS, SUBSCRIPTION ITEMS
router.get('/api/checkout/success/sub/:sessionId',
  async (req, res) => {
    try {
      validateToken(req, res)
      const userId = req.user.id
      const user = await getAppUser(userId)

      // update with stripe customer payment info
      const stripeSubUpdate = await updateSub(user, req.params.sessionId)

      if (!stripeSubUpdate) {
        resetSubOrder(user)
        throw new Error('stripe subscription update failed')
      }

      // add the names of subscribed items to list
      await addItemNamesToList(user, req.params.sessionId)

      // add order to subscription archive store
      await addSubToSubArchive(user, stripeSubUpdate)

      // reset subscription store
      await resetSubOrder(user)

      // get subscription from subscription archive for use on client side
      const subArchive = await retrieveSubArchive(user._id)

      const sub = subArchive.subscriptions.find((subItem) => subItem.checkoutSessionId === req.params.sessionId)

      if (!sub) {
        throw new Error('subscription not found in archive')
      }

      res.send({ status: 'subscription checkout success', subscription: sub })
    } catch (err) {
      const { message } = err
      if (message === 'token not found on request' || message === 'refresh token expired') {
        res.status(401).send({ error: err.message })
        return
      }
      res.status(500).send({ error: err.message })
    }
  })

// CHECKOUT FAILURE, MULTIPLE ITEMS
router.get('/api/checkout/failure/regular/:sessionId', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    await resetOrder(user)

    res.send({ status: 'checkout session failed and regular order resets' })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

// CHECKOUT FAILURE, SUBSCRIPTION ITEMS
router.get('/api/checkout/failure/sub/:sessionId', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    await resetSubOrder(user)

    res.send({ status: 'checkout session failed and sub order resets' })
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

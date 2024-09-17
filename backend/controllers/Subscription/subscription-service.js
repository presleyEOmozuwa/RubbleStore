const { Subscription } = require('../Models/common-model')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { three, five, seven } = require('../Utils/order-id-generator')

const getSub = async (userId) => {
  const sub = await Subscription.findOne({ userId })
  return sub
}

const retrieveSub = async (userId) => {
  const sub = await Subscription.findOne({ userId })
  if (!sub) {
    throw new Error('subscription not found')
  }

  return sub
}

const createSub = async (user, checkoutSession) => {
  const sub = await retrieveSub(user._id)
  sub.set({
    checkoutSessionId: checkoutSession.id,
    subNumber: `#${three()}-${five()}-${seven()}`
  })

  const extractSub = await sub.save()

  return extractSub
}

const updateSub = async (user, checkoutSessionId) => {
  const sub = await retrieveSub(user._id)

  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)

  const invoice = await stripe.invoices.retrieve(session.invoice)

  const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent)

  const charge = await stripe.charges.retrieve(
    paymentIntent.latest_charge
  )

  sub.set({
    stripecustomerid: user.stripecustomerid,
    cardType: charge.payment_method_details.card.brand,
    last4: charge.payment_method_details.card.last4,
    tax: session.total_details.amount_tax,
    paymentStatus: session.payment_status,
    orderTotal: session.amount_total / 100
  })

  const modifiedSub = await sub.save()

  return modifiedSub
}

const resetSubOrder = async (user) => {
  const userSub = await retrieveSub(user._id)
  userSub.set({
    stripecustomerid: 'stripe customer id',
    subNumber: 'subscription unique identifier',
    checkoutSessionId: 'checkout session id',
    currentPeriodStarts: 'current period starts',
    paymentStatus: 'unpaid',
    cardType: 'card type',
    last4: 'last 4 digits',
    tax: 0,
    orderTotal: 10.99,
    subItems: []
  })

  await userSub.save()
}

module.exports = { createSub, getSub, retrieveSub, updateSub, resetSubOrder }

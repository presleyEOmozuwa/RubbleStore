const { Order } = require('../Models/common-model')
const { generateDate } = require('../Utils/date-utils')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { three, five, seven } = require('../Utils/order-id-generator')

const getOrder = async (userId) => {
  const order = await Order.findOne({ userId })
  return order
}

const retrieveOrder = async (userId) => {
  const order = await Order.findOne({ userId })
  if (!order) {
    throw new Error('order not found')
  }

  return order
}

const createOrder = async (user, checkoutSession) => {
  const order = await retrieveOrder(user._id)
  order.set({
    checkoutSessionId: checkoutSession.id,
    orderNumber: `#${three()}-${five()}-${seven()}`
  })

  await order.save()

  return order
}

const updateOrder = async (user, checkoutSessionId) => {
  const order = await retrieveOrder(user._id)

  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)

  const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent)

  const charge = await stripe.charges.retrieve(
    paymentIntent.latest_charge
  )

  order.set({
    stripecustomerid: user.stripecustomerid,
    orderplaced: generateDate(),
    customerAddress: {
      status: 'completed',
      city: session.customer_details.address.city,
      country: session.customer_details.address.city,
      line1: session.customer_details.address.line1,
      line2: session.customer_details.address.line2,
      postalcode: session.customer_details.address.postal_code,
      state: session.customer_details.address.state,
      phone: session.customer_details.phone,
      name: session.customer_details.name
    },
    cardType: charge.payment_method_details.card.brand,
    last4: charge.payment_method_details.card.last4,
    tax: session.total_details.amount_tax,
    paymentStatus: session.payment_status,
    orderTotal: session.amount_total / 100
  })

  const modifiedOrder = await order.save()

  return modifiedOrder
}

const resetOrder = async (user) => {
  const userOrder = await retrieveOrder(user._id)
  userOrder.set({
    stripecustomerid: 'stripe customer id',
    orderNumber: 'order unique identifier',
    deliveryTrackingId: 'delivery tracking id',
    deliveryTrackingUrl: 'delivery tracking url',
    orderplaced: 'date of order',
    checkoutSessionId: 'checkout session id',
    estimatedDeliveryDate: 'estimated delivery date',
    customerAddress: {},
    deliveryStatus: 'pending',
    paymentStatus: 'unpaid',
    cardType: 'card type',
    last4: 'last 4 digits',
    shipping: 0,
    tax: 0,
    orderTotal: 10.99,
    cartItems: []
  })

  await userOrder.save()
}

module.exports = { createOrder, getOrder, retrieveOrder, updateOrder, resetOrder }

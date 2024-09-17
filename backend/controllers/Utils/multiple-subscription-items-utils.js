/* eslint-disable camelcase */
const stripe = require('stripe')(process.env.STRIPE_KEY)

const multipleSubscriptionItemsHandler = async (user, cartItems) => {
  const line_items = cartItems.map((product) => {
    return {
      price: product.priceId,
      quantity: product.quantity
    }
  })

  const session = await stripe.checkout.sessions.create({
    customer: user.stripecustomerid,
    line_items,
    mode: 'subscription',
    success_url: `${process.env.LOAD_BALANCER_BASE_URL}/auth/checkout/sub/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.LOAD_BALANCER_BASE_URL}/auth/checkout/failure/sub/{CHECKOUT_SESSION_ID}`
  })

  return session
}

/* eslint-enable camelcase */

module.exports = { multipleSubscriptionItemsHandler }

const stripe = require('stripe')(process.env.STRIPE_KEY)

const deleteStripeUser = async (stripecusId) => {
  await stripe.customers.del(stripecusId)
}

module.exports = { deleteStripeUser }

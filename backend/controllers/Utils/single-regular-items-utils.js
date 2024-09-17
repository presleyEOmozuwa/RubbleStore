/* eslint-disable camelcase */

const stripe = require('stripe')(process.env.STRIPE_KEY)

const singleRegularItemHandler = async (user, cartItems) => {
  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.prodName,
          images: [item.imageUrl],
          description: item.des
        },
        unit_amount: Math.floor(item.newPrice * 100)
      },
      quantity: item.quantity
    }
  })
  const session = await stripe.checkout.sessions.create({
    customer: user.stripecustomerid,
    line_items,
    automatic_tax: {
      enabled: false
    },
    payment_method_types: ['card'],
    phone_number_collection: {
      enabled: true
    },
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA']
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd'
          },
          display_name: 'Free shipping'
        }
      }
    ],
    mode: 'payment',
    success_url: `${process.env.LOAD_BALANCER_BASE_URL}/auth/checkout/regular/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.LOAD_BALANCER_BASE_URL}/auth/checkout/failure/regular/{CHECKOUT_SESSION_ID}`
  })

  return session
}

/* eslint-enable camelcase */

module.exports = { singleRegularItemHandler }

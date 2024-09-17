const stripe = require('stripe')(process.env.STRIPE_KEY)

const stripeChecker = async (email) => {
  const customers = await stripe.customers.list()
  const { data } = customers
  const found = data.find((cus) => cus.email === email)
  if (!found) {
    return false
  }
  return true
}

const stripeCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email
  })

  // if(!customer || objCheckerOne(customer) === 0){
  //     throw new Error("stripe registration failed")
  // }

  return customer
}

module.exports = { stripeCustomer, stripeChecker }

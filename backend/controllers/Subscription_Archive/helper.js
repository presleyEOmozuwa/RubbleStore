const { retrieveSubArchive } = require('./sub-archive-service')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const addItemNamesToList = async (user, checkoutSessionId) => {
  const subArchive = await retrieveSubArchive(user._id)

  const { subNames } = subArchive

  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)

  const invoice = await stripe.invoices.retrieve(
    session.invoice
  )

  invoice.lines.data.forEach(async (item) => {
    const prod = await stripe.products.retrieve(item.price.product)

    const modified = [...subNames, prod.name]

    subArchive.set({
      subNames: modified
    })

    await subArchive.save()
  })
}

module.exports = { addItemNamesToList }

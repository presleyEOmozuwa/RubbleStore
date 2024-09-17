const { getSubCart } = require('../Cart_Subscription_Items/subcart-service')
const { SubCart } = require('../Models/common-model')
const { objCheckerOne } = require('./obj-checker-utils')

const assignSubCartToUser = async (user) => {
  const subcart = await getSubCart(user)
  if (subcart) {
    console.log(subcart)
  }
  const createdSubCart = await SubCart.create({
    userId: user._id,
    email: user.email
  })

  if (!createdSubCart || objCheckerOne(createdSubCart) === 0) {
    throw new Error('subscription cart creation failed')
  }
  return createdSubCart
}

const addProductToSubCart = async (subcartId, product) => {
  await SubCart.findByIdAndUpdate(
    subcartId,
    { $addToSet: { subItems: [product._id] } },
    { new: true }
  )
}

const removeProductFromSubCart = async (subcartId, product) => {
  await SubCart.findByIdAndUpdate(
    subcartId,
    { $pullAll: { subItems: [product._id] } },
    { new: true }
  )
}

module.exports = { assignSubCartToUser, addProductToSubCart, removeProductFromSubCart }

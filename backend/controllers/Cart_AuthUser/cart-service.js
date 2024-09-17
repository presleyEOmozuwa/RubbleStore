const { Cart } = require('../Models/common-model')

const getCart = async (user) => {
  const cart = await Cart.findOne({ userId: user._id })
  return cart
}

const retrieveCart = async (userId) => {
  const cart = await Cart.findOne({ userId })

  if (!cart) {
    throw new Error('cart not found')
  }

  return cart
}

const retrieveCartPlus = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('products')

  if (!cart) {
    throw new Error('cart not found')
  }

  return cart
}

module.exports = { getCart, retrieveCart, retrieveCartPlus }

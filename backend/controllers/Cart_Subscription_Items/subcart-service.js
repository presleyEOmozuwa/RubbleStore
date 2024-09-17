const { SubCart } = require('../Models/common-model')

const getSubCart = async (user) => {
  const subcart = await SubCart.findOne({ userId: user._id })
  return subcart
}

const retrieveSubCart = async (userId) => {
  const subcart = await SubCart.findOne({ userId })

  if (!subcart) {
    throw new Error('subcart not found')
  }

  return subcart
}

const retrieveSubCartPlus = async (userId) => {
  const subcart = await SubCart.findOne({ userId }).populate('subItems')

  if (!subcart) {
    throw new Error('subcart not found')
  }

  return subcart
}

module.exports = { getSubCart, retrieveSubCart, retrieveSubCartPlus }

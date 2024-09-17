const { Product } = require('../Models/common-model')

const addCartToProduct = async (productId, cartId) => {
  await Product.findByIdAndUpdate(
    productId,
    { $push: { carts: [cartId] } },
    { new: true }
  )
}

const addCategoryToProduct = async (productId, category) => {
  await Product.findByIdAndUpdate(
    productId,
    { $addToSet: { categories: [category._id] } },
    { new: true }
  )
}

const addCategoryToUpdatedProduct = async (productId, category) => {
  await Product.findByIdAndUpdate(
    productId,
    { $addToSet: { categories: [category._id] } },
    { new: true }
  )
}

const removeCategoryFromProduct = async (productId, category) => {
  await Product.findByIdAndUpdate(
    productId,
    { $pullAll: { categories: [category._id] } },
    { new: true }
  )
}

module.exports = { addCartToProduct, addCategoryToProduct, addCategoryToUpdatedProduct, removeCategoryFromProduct }

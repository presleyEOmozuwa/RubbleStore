const { Category } = require('../Models/common-model')

const addProductToCategory = async (categoryId, product) => {
  await Category.findByIdAndUpdate(
    categoryId,
    { $push: { products: [product._id] } },
    { new: true }
  )
}

module.exports = { addProductToCategory }

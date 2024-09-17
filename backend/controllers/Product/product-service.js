const { Product } = require('../Models/common-model')

// GET ALL PRODUCTS
const getProductlist = async (count, page) => {
  if (!count || !page) {
    throw new Error('missing query parameters')
  }

  const countInt = parseInt(count)
  const pageInt = parseInt(page)
  const offset = countInt * pageInt

  if (isNaN(countInt) || isNaN(pageInt)) {
    throw new Error('invalid value for query parameters')
  }

  if (countInt <= 0 || pageInt < 0) {
    throw new Error('query parameters cannot be negative values')
  }

  const products = await Product.find({ typeOfItem: 'regular' }).limit(countInt).skip(offset)

  if (!products) {
    throw new Error('product list request failed')
  }

  return products
}

// GET ALL PRODUCTS
const getSubProducts = async () => {
  const products = await Product.find({ typeOfItem: 'subscription' })

  if (!products) {
    throw new Error('product list request failed')
  }

  return products
}

// // GET A SINGLE PRODUCT
const getProduct = async (productId) => {
  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new Error('product not found')
  }

  return product
}

// GET A SINGLE PRODUCT
const getProductWithCategories = async (productId) => {
  const product = await Product.findOne({ _id: productId }).populate('categories')

  if (!product) {
    throw new Error('product not found')
  }

  return product
}

// CREATE PRODUCT
const createProduct = async (payload) => {
  const con = {}

  if (!payload) {
    throw new Error('please provide required fields')
  }

  const temp = {
    prodName: payload.prodName,
    price: payload.price,
    coupon: payload.coupon ? payload.coupon : 0,
    priceId: payload.priceId,
    stockQty: payload.stockQty,
    des: payload.des,
    imageUrl: payload.imageUrl,
    typeOfItem: payload.typeOfItem
  }
  temp.newPrice = ((100 - temp.coupon) / 100 * temp.price).toFixed(2)

  const product = await Product.create(temp)

  if (!product) {
    throw new Error('product creation failed')
  }

  con.product = product

  return con
}

// UPDATE PRODUCT
const upDateProduct = async (payload) => {
  const con = {}

  if (!payload) {
    throw new Error('product edit data not found on request')
  }

  const product = await getProduct(payload.id)

  // if (!product) {
  //   throw new Error('product not found on db')
  // }

  product.set({
    prodName: payload.prodName,
    price: payload.price,
    coupon: payload.coupon ? payload.coupon : 0,
    priceId: payload.priceId,
    des: payload.des,
    stockQty: payload.stockQty,
    imageUrl: payload.imageUrl,
    typeOfItem: payload.typeOfItem
  })
  product.newPrice = ((100 - product.coupon) / 100 * product.price).toFixed(2)

  const upDatedProduct = await product.save()

  if (!upDatedProduct) {
    throw new Error('product update failed')
  }

  con.upDatedProduct = upDatedProduct

  return con
}

// DELETE PRODUCT
const deleteProduct = async (productId) => {
  const con = {}
  const product = await getProduct(productId)
  const result = await Product.deleteOne(product)
  const { acknowledged, deletedCount } = result
  con.deletedItem = product
  con.isDeleted = true
  con.result = { acknowledged, deletedCount }
  return con
}

module.exports = { getProductWithCategories, getSubProducts, getProductlist, getProduct, createProduct, upDateProduct, deleteProduct }

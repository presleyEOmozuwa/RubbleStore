const { getCart, retrieveCart } = require('../Cart_AuthUser/cart-service')
const { Cart } = require('../Models/common-model')
const { objCheckerOne, objCheckerTwo } = require('./obj-checker-utils')

const assignCartToUser = async (user) => {
  const cart = await getCart(user)
  if (cart) {
    console.log(cart)
  }
  const createdCart = await Cart.create({
    userId: user._id,
    email: user.email
  })

  if (!createdCart || objCheckerOne(createdCart) === 0) {
    throw new Error("user's cart creation failed")
  }
  return createdCart
}

const addProductToCart = async (cartId, product) => {
  await Cart.findByIdAndUpdate(
    cartId,
    { $addToSet: { products: [product._id] } },
    { new: true }
  )
}

const removeProductFromCart = async (cartId, product) => {
  await Cart.findByIdAndUpdate(
    cartId,
    { $pullAll: { products: [product._id] } },
    { new: true }
  )
}

const transferSessionProductsToCart = async (cartId, sessionProduct) => {
  const update = await Cart.findByIdAndUpdate(
    cartId,
    { $addToSet: { products: [sessionProduct._id] } },
    { new: true }
  )

  if (!update || objCheckerOne(update) === 0) {
    throw new Error("unsuccessful transfer of user's session products to his newly created database cart failed")
  }

  return update
}

const sessionProductsHandler = async (products, user, response) => {
  if (products && objCheckerTwo(products) > 0) {
    products.forEach(async (product) => {
      const cart = await retrieveCart(user._id)
      await transferSessionProductsToCart(cart._id, product)
    })
    response.session.destroy()
  }
}

module.exports = { assignCartToUser, addProductToCart, removeProductFromCart, sessionProductsHandler }

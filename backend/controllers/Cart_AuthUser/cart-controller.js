const express = require('express')
const router = express.Router()
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveCart, retrieveCartPlus } = require('./cart-service')
const { addProductToCart, removeProductFromCart } = require('../Utils/cart-util')
const { getProduct } = require('../Product/product-service')
const { validateToken } = require('../Token/tokenValidator')

router.post('/api/addtocart/loggedInUser', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const cart = await retrieveCart(user._id)

    const product = await getProduct(req.body.productId)

    const shoppingcart = await addProductToCart(cart._id, product)

    res.send({ status: 'product successfully added to cart', shoppingcart })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.get('/api/cart', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const cart = await retrieveCartPlus(user._id)

    res.send({ cart })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

// REQUEST FROM LOGGED IN USER TO DELETE CART PRODUCT
router.delete('/api/removefromcart/:productId', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const cart = await retrieveCart(user._id)

    const product = await getProduct(req.params.productId)

    await removeProductFromCart(cart._id, product)

    res.send({ isProductRemoveFromCart: true, status: 'product removed from cart successfully', product })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

module.exports = router

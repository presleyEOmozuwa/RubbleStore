const express = require('express')
const router = express.Router()
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveSubCart, retrieveSubCartPlus } = require('./subcart-service')
const { addProductToSubCart, removeProductFromSubCart } = require('../Utils/cart-subitems-utils')
const { getProduct } = require('../Product/product-service')
const { validateToken } = require('../Token/tokenValidator')

router.post('/api/sub/addtocart', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const subcart = await retrieveSubCart(user._id)

    const product = await getProduct(req.body.productId)

    await addProductToSubCart(subcart._id, product)

    res.send({ status: 'product successfully added to subcart' })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

router.get('/api/sub/cart', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const subcart = await retrieveSubCartPlus(user._id)

    res.send({ subcart })
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
router.delete('/api/sub/removefromcart/:productId', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const subcart = await retrieveSubCart(user._id)

    const product = await getProduct(req.params.productId)

    await removeProductFromSubCart(subcart._id, product)

    res.send({ status: 'product removed from cart successfully', product })
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

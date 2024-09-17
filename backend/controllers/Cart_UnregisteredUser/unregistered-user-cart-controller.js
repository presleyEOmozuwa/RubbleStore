const express = require('express')
const router = express.Router()
const { getProduct } = require('../Product/product-service')

router.post('/api/addtocart/guestUser', async (req, res) => {
  try {
    const productlist = req.session.products ??= []
    const product = await getProduct(req.body.productId)
    if (productlist.length === 0) {
      productlist.push(product)
      res.send({ status: 'product successfully added to cart' })
    } else if (productlist.length === 1) {
      const item = productlist[0]
      if (item.prodName === product.prodName) {
        throw new Error('product already exist on cart')
      }
      productlist.push(product)
      res.send({ status: 'product successfully added to cart' })
    } else if (productlist.length > 1) {
      const found = productlist.some((prod) => prod.prodName === product.prodName)
      if (found) {
        throw new Error('product already exist on cart')
      }
      productlist.push(product)
      res.send({ status: 'product successfully added to cart' })
    }
  } catch (err) {
    const { message } = err
    if (message === 'product already exist on cart') {
      res.status(400).send({ error: message })
      return
    }
    res.status(500).send({ error: message })
  }
})

// REQUEST FROM UNREGISTERED USER TO GET SESSION CART ITEMS
router.get('/api/shopping-cart/guestUser', (req, res) => {
  try {
    if (!req.session.products) {
      throw new Error('cart is empty')
    }

    res.send({ cart: { products: req.session.products } })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

// REQUEST FROM UNREGISTERED USER TO DELETE A PRODUCT FROM SESSION CART
router.post('/api/delete-item/guestUser', (req, res) => {
  try {
    const product = req.session.products?.find((p) => p._id === req.body.productId)
    if (!product) {
      throw new Error('product not found, nothing to delete')
    }
    const index = req.session.products?.indexOf(product)
    req.session.products?.splice(index, 1)
    res.send({ status: 'product removed from cart successfully', deletedItem: product })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

module.exports = router

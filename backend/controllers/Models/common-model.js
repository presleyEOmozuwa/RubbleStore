const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { ObjectId } = Schema.Types

const productSchema = new Schema({
  prodName: {
    type: String,
    default: 'product name'
  },

  price: {
    type: Number,
    default: 1.55
  },

  coupon: {
    type: Number,
    required: true
  },

  newPrice: {
    type: Number,
    default: 0.55
  },

  priceId: {
    type: String,
    default: 'price identifier'
  },

  quantity: {
    type: Number,
    default: 1
  },

  stockQty: {
    type: Number,
    default: 0
  },

  des: {
    type: String,
    default: 'product description'
  },

  imageUrl: {
    type: String,
    default: 'image url'
  },

  typeOfItem: {
    type: String,
    default: 'type of item'
  },

  subtotal: {
    type: Number,
    default: 0
  },

  carts: [{ type: ObjectId, ref: 'Cart', default: null }],

  categories: {
    type: [{ type: ObjectId, ref: 'Category', default: null }]
  }

}, { timestamps: true })

const Product = model('Product', productSchema)

const cartSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },
  email: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: 'cart assigned to user'
  },
  products: [{ type: ObjectId, ref: 'Product', default: null }]
})

const Cart = model('Cart', cartSchema)

const subCartSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },

  email: {
    type: String,
    default: null
  },

  description: {
    type: String,
    default: 'subscription cart assigned to user'
  },

  subItems: [{ type: ObjectId, ref: 'Product', default: null }]
})

const SubCart = model('SubCart', subCartSchema)

const categorySchema = new Schema({
  catName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  ischecked: {
    type: Boolean,
    default: false
  },

  products: [{ type: ObjectId, ref: 'Product' }]

}, { timestamps: true })

const Category = model('Category', categorySchema)

const customerAddressSchema = new Schema({
  status: { type: String, default: 'status' },

  city: { type: String, default: 'city' },

  country: { type: String, default: 'country' },

  line1: { type: String, default: 'line1' },

  line2: { type: String, default: 'line2' },

  postalcode: { type: String, default: 'postal_code' },

  state: { type: String, default: 'state' },

  phone: { type: String, default: 'phone' },

  name: { type: String, default: 'name' }

}, { timestamps: true })

const subSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },
  email: {
    type: String,
    default: null
  },

  stripecustomerid: {
    type: String,
    default: 'stripe customer id'
  },

  subNumber: {
    type: String,
    default: 'subscription unique identifier'
  },

  checkoutSessionId: {
    type: String,
    default: 'checkout session id'
  },

  currentPeriodStarts: { type: String, default: 'current period starts' },

  cardType: { type: String, default: 'card type' },

  last4: { type: String, default: 'last 4 digits' },

  tax: { type: Number, default: 0.00 },

  paymentStatus: { type: String, default: 'unpaid' },

  orderTotal: { type: Number, default: 10.99 },

  subItems: [{ type: productSchema, default: { } }]

}, { timestamps: true })

const Subscription = model('Subscription', subSchema)

const orderSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },
  email: {
    type: String,
    default: null
  },
  stripecustomerid: {
    type: String,
    default: 'stripe customer id'
  },

  orderNumber: {
    type: String,
    default: 'order unique identifier'
  },

  checkoutSessionId: {
    type: String,
    default: 'checkout session id'
  },

  deliveryTrackingId: {
    type: String,
    default: 'delivery tracking id'
  },

  deliveryStatus: { type: String, default: 'pending' },

  deliveryTrackingUrl: {
    type: String,
    default: 'delivery tracking url'
  },

  estimatedDeliveryDate: {
    type: String,
    default: 'estimated delivery date'
  },

  orderplaced: { type: String, default: 'date of order' },

  cardType: { type: String, default: 'card type' },

  last4: { type: String, default: 'last 4 digits' },

  shipping: { type: Number, default: 0.00 },

  tax: { type: Number, default: 0.00 },

  customerAddress: { type: customerAddressSchema, default: { } },

  paymentStatus: { type: String, default: 'unpaid' },

  orderTotal: { type: Number, default: 10.99 },

  cartItems: [{ type: productSchema, default: { } }]

}, { timestamps: true })

const Order = model('Order', orderSchema)

const orderArchiveSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },
  email: {
    type: String,
    default: null
  },

  orders: [{ type: orderSchema, default: { } }]

}, { timestamps: true })

const OrderArchive = model('OrderArchive', orderArchiveSchema)

const subArchiveSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },
  email: {
    type: String,
    default: null
  },
  subNames: [String],

  subscriptions: [{ type: subSchema, default: { } }]

}, { timestamps: true })

const SubArchive = model('SubArchive', subArchiveSchema)

module.exports = { Product, Cart, SubCart, Category, Order, OrderArchive, Subscription, SubArchive }

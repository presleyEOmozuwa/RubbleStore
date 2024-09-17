const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { Cart, SubCart, OrderArchive, Order, Subscription, SubArchive } = require('./common-model')
const RefreshToken = require('./refreshToken-model')

// Declare the Schema of the Mongo model
const userSchema = new Schema({
  stripecustomerid: {
    type: String,
    default: 'stripecustomerid'
  },

  username: {
    type: String,
    default: 'username'
  },

  email: {
    type: String,
    unique: true,
    default: null
  },

  password: {
    type: String,
    default: 'password'
  },

  role: {
    type: String,
    default: 'role'
  },

  confirmemail: {
    type: String,
    default: 'false'
  },

  terms: {
    type: Boolean,
    default: false
  },

  privacy: {
    type: Boolean,
    default: false
  },

  isblocked: {
    type: String,
    default: 'false'
  },

  isloggedIn: {
    type: Boolean,
    default: false
  },

  otpsecret: {
    type: String,
    default: 'otp secret'
  }

}, { timestamps: true })

userSchema.pre('deleteOne', { document: true, query: true }, async function () {
  await Promise.all([
    Cart.deleteOne({ userId: this._id }),
    SubCart.deleteOne({ userId: this._id }),
    RefreshToken.deleteOne({ userId: this._id }),
    OrderArchive.deleteOne({ userId: this._id }),
    Order.deleteOne({ userId: this._id }),
    Subscription.deleteOne({ userId: this._id }),
    SubArchive.deleteOne({ userId: this._id })
  ])
})

const User = model('User', userSchema)

module.exports = User

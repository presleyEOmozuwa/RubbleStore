const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { ObjectId } = Schema.Types

const refreshTokenSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', default: null },
  email: {
    type: String,
    default: null
  },

  refreshtoken: {
    type: String,
    default: null
  }

}, { timestamps: true })

const RefreshToken = model('RefreshToken', refreshTokenSchema)

module.exports = RefreshToken

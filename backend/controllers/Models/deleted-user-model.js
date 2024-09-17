const mongoose = require('mongoose')
const { Schema, model } = mongoose

const deletedUserSchema = new Schema({
  userId: {
    type: String,
    default: 'userId'
  },
  email: {
    type: String,
    default: null
  },
  username: {
    type: String,
    default: 'username'
  }
}, { timestamps: true })

const DeletedUser = model('DeletedUser', deletedUserSchema)

module.exports = DeletedUser

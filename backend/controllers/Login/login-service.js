const bcrypt = require('bcryptjs')
const User = require('../Models/user-model')
const DeletedUser = require('../Models/deleted-user-model')
const BlockedUser = require('../Models/blocked-user-model')
const { objCheckerOne } = require('../Utils/obj-checker-utils')

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('email and password fields are required')
  }

  const delUser = await DeletedUser.findOne({ email })

  if (delUser) {
    throw new Error('email is associated to a closed account')
  }

  const blockeduser = await BlockedUser.findOne({ email })

  if (blockeduser) {
    throw new Error('email is associated to a blocked account')
  }

  // FIND USER BY EMAIL
  const authUser = await User.findOne({ email })

  if (!authUser) {
    throw new Error('invalid email or password')
  }

  // IF USER FOUND, VERIFY PASSWORD
  const comparePassword = await bcrypt.compare(password, authUser.password)

  if (!comparePassword) {
    throw new Error('invalid email or password')
  }

  return authUser
}

const googleloginUser = async (payload) => {
  if (!payload || objCheckerOne(payload) === 0) {
    throw new Error('authentication failed, contact google')
  }

  const delUser = await DeletedUser.findOne({ email: payload.email })

  if (delUser) {
    throw new Error('email is associated to a closed account')
  }

  const blockeduser = await BlockedUser.findOne({ email: payload.email })

  if (blockeduser) {
    throw new Error('email is associated to a blocked account')
  }

  const user = await User.findOne({ email: payload.email })

  return user
}

module.exports = { loginUser, googleloginUser }

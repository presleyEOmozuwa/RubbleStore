const bcrypt = require('bcryptjs')
const User = require('../Models/user-model')
const DeletedUser = require('../Models/deleted-user-model')
const { validationSchema } = require('../Utils/register-validation-utils')
const { stripeCustomer, stripeChecker } = require('./register-helper')
const { objCheckerOne, objCheckerTwo } = require('../Utils/obj-checker-utils')

const register = async (payload) => {
  let createdUser

  if (!payload || objCheckerOne(payload) === 0) {
    throw new Error('please provide required fields')
  }

  // VALIDATE USER DATA
  const { error, value } = validationSchema.validate(payload)

  if (error) {
    throw new Error('inputs validation failed')
  }

  if (value) {
    const deleteUser = await DeletedUser.findOne({ email: value.email })

    if (deleteUser && objCheckerTwo(deleteUser) > 0) {
      throw new Error('email cannot be used for registration, it is associated to a deleted account')
    }

    // Check if user already exist on db
    const user = await User.findOne({ email: value.email })
    if (user && objCheckerTwo(user) > 0) {
      throw new Error('email already in use')
    }

    // Check if user alredy exist on Stripe
    const isAlreadyExist = await stripeChecker(value.email)
    if (isAlreadyExist) {
      throw new Error('email already in use')
    }

    const hashedPassword = await bcrypt.hash(value.password, 10)

    if (!hashedPassword) {
      throw new Error('password hashing failed')
    }

    // CREATE CLIENT ON STRIPE
    const customer = await stripeCustomer(value.email)

    // CREATE CLIENT ACCOUNT
    createdUser = await User.create({
      username: value.username,
      email: value.email,
      password: hashedPassword,
      role: 'client',
      stripecustomerid: customer.id,
      terms: value.terms,
      privacy: value.privacy
    })

    if (!createdUser || objCheckerOne(createdUser) === 0) {
      throw new Error('Sorry, try again later')
    }
  }

  return createdUser
}

module.exports = { register, stripeCustomer }

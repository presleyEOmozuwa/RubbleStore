const bcrypt = require('bcryptjs')
const User = require('../Models/user-model')
const { validationSchema } = require('../Utils/register-validation-utils')

const registerAdmin = async (payload) => {
  const con = { }

  if (!payload) {
    throw new Error('data not found')
  }

  const { error, value } = validationSchema.validate(payload)

  if (error) {
    throw new Error(error.message)
  }

  if (value && value.email === process.env.ADMIN_EMAIL) {
    const adminuser = await User.findOne({ email: process.env.ADMIN_EMAIL })

    if (adminuser) {
      throw new Error('admin email already exist')
    }

    const hashedPassword = await bcrypt.hash(value.password, 10)

    if (!hashedPassword) {
      throw new Error('admin password hash unsuccessful')
    }

    const temp = {
      stripecustomerid: 'not applicable',
      username: value.username,
      email: value.email,
      password: hashedPassword,
      role: 'admin',
      terms: value.terms
    }

    // CREATE ADMIN ACCOUNT
    const adminUser = await User.create(temp)

    if (!adminUser) {
      throw new Error('admin registration failed')
    }

    con.adminUser = adminUser
  }

  return con
}

module.exports = { registerAdmin }

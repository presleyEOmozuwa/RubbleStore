const otpGen = require('otp-generator')
const otpTool = require('otp-without-db')
const User = require('../Models/user-model')

const cookieSetter = (res, accToken, renewToken) => {
  res.cookie('renewToken', renewToken, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000
  })
  res.cookie('accToken', accToken, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 5 * 60 * 60 * 1000
  })
}

const createOTP = () => {
  const token = otpGen.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
  return token
}

const createHash = (email, otp, key) => {
  const hash = otpTool.createNewOTP(email, otp, key)
  return hash
}

const checkOTP = (email, otp, hash, key) => {
  const isValid = otpTool.verifyOTP(email, otp, hash, key)
  return isValid
}

const loggedIn = async (user) => {
  user.set({
    isloggedIn: true
  })
  const authuser = await user.save()
  return authuser
}

const loggedOut = async (user) => {
  await User.updateOne(
    { _id: user._id, isloggedIn: true },
    { $set: { isloggedIn: false } }
  )
}

module.exports = { createOTP, createHash, checkOTP, loggedIn, loggedOut, cookieSetter }

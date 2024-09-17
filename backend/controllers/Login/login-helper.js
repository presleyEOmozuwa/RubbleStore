const { signAccessToken, signRefreshToken, signRefreshTokenPlus, saveRefreshToken } = require('../Utils/token.utils')
const { sendOTPtoUser } = require('../Utils/email-utils')
const LocationTracker = require('../Models/location-tracker-model')
const { loggedIn, cookieSetter } = require('./login-helper-ext')

const sessionIdMatch = async (user, sessionId) => {
  const loc = await LocationTracker.findOne({
    userId: user.userId,
    locationId: sessionId
  })
  return loc
}

const loginChecker = async (user, useToken, rememberMe, sessionId, res, otp, hash) => {
  const loc = await sessionIdMatch(user, sessionId)
  if (useToken || (useToken && rememberMe)) {
    await sendOTPtoUser(user, otp)
    res.send({ status: 'otp sent to user', userId: user._id, hash })
  } else if (rememberMe && loc) {
    const accToken = signAccessToken(user)
    const renewToken = signRefreshTokenPlus(user)
    await saveRefreshToken(user, renewToken)
    const authuser = await loggedIn(user)
    cookieSetter(res, accToken, renewToken)
    res.send({ status: 'login successful', user: authuser })
  } else if (!rememberMe && loc) {
    const accToken = signAccessToken(user)
    const renewToken = signRefreshToken(user)
    await saveRefreshToken(user, renewToken)
    const authuser = await loggedIn(user)
    cookieSetter(res, accToken, renewToken)
    res.send({ status: 'login successful', user: authuser })
  } else if (!rememberMe && !loc) {
    await sendOTPtoUser(user, otp)
    console.log(loc)
    res.send({ status: 'otp sent to user', hash })
  } else {
    const accToken = signAccessToken(user)
    const renewToken = signRefreshToken(user)
    await saveRefreshToken(user, renewToken)
    const authuser = await loggedIn(user)
    cookieSetter(res, accToken, renewToken)
    res.send({ status: 'login successful', user: authuser })
  }
}

module.exports = { loginChecker }

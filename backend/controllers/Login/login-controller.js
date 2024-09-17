const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { getAppUser } = require('../AppUser/appuser-service')
const { signAccessToken, signRefreshToken, signRefreshTokenPlus, verifyRefreshTokenForLogout, verifyGoogleToken, saveRefreshToken } = require('../Utils/token.utils')
const { loginUser, googleloginUser } = require('./login-service')
const User = require('../Models/user-model')
const { assignCartToUser } = require('../Utils/cart-util')
const { assignSubCartToUser } = require('../Utils/cart-subitems-utils')
const { assignOrderArchiveToUser, assignOrderStoreToUser } = require('../Utils/order-utils')
const { refreshTokenStore } = require('../Utils/token.utils')
const { assignSubscriptionToUser, assignSubArchiveToUser } = require('../Utils/subscription-utils')
const { loginChecker } = require('./login-helper')
const { cookieSetter } = require('./login-helper-ext')
const { createOTP, createHash, checkOTP, loggedIn, loggedOut } = require('./login-helper-ext')
const { getTokenList, deleteRefreshToken } = require('../Token/refreshToken-service')

router.post('/api/login/payload', async (req, res) => {
  try {
    const authUser = await loginUser(req.body.email, req.body.password)
    const otp = createOTP()
    const hash = createHash(authUser.email, otp, process.env.OTP_SECRET_KEY)
    await loginChecker(authUser, req.body.useToken, req.sessionID, req.body.rememberMe, res, otp, hash)
  } catch (err) {
    const { message } = err
    if (message === 'email and password fields are required' || message === 'email is associated to a closed account' || message === 'email is associated to a blocked account' || message === 'invalid email or password') {
      res.status(400).send({ error: message })
    } else {
      res.status(500).send({ error: message })
    }
  }
})

router.post('/api/otp-code', async (req, res) => {
  try {
    const { code, userId, hashed } = req.body.payload
    const user = await getAppUser(userId)
    const isValid = checkOTP(user.email, code, hashed, process.env.OTP_SECRET_KEY)

    if (!isValid) {
      throw new Error('OTP validation failed')
    }

    const accToken = signAccessToken(user)
    const renewToken = signRefreshTokenPlus(user)
    await saveRefreshToken(user, renewToken)
    const appuser = await loggedIn(user)
    cookieSetter(res, accToken, renewToken)
    res.send({ status: 'login successful', user: appuser })
  } catch (err) {
    const { message } = err
    if (message === 'OTP validation failed') {
      res.status(400).send({ error: message })
    } else {
      res.status(500).send({ error: err.message })
    }
  }
})

router.post('/api/google-signin', async (req, res) => {
  try {
    // VERIFY GOOGLE CREDENTIALS
    const { clientId, token } = req.body.payload
    const payload = await verifyGoogleToken(clientId, token)
    const user = await googleloginUser(payload)

    // if true, it indicates that the user has an account with the app
    if (user) {
      const accToken = signAccessToken(user)
      const renewToken = signRefreshTokenPlus(user)
      await saveRefreshToken(user, signRefreshTokenPlus(user))
      const authuser = await loggedIn(user)
      cookieSetter(res, accToken, renewToken)
      res.send({ status: 'login successful', user: authuser })
      return
    }

    const customer = await stripe.customers.create({
      email: payload.email
    })

    const logger = await User.create({
      username: 'google',
      email: payload.email,
      password: 'identity',
      role: 'client',
      stripecustomerid: customer.id,
      confirmemail: true,
      terms: true,
      privacy: true
    })

    if (!logger) {
      throw new Error('google logger registration failed')
    }

    await assignCartToUser(logger)
    await assignSubCartToUser(logger)
    await refreshTokenStore(logger)
    await assignOrderStoreToUser(logger)
    await assignOrderArchiveToUser(logger)
    await assignSubscriptionToUser(logger)
    await assignSubArchiveToUser(logger)

    const accToken = signAccessToken(logger)
    const renewToken = signRefreshToken(logger)
    await saveRefreshToken(logger, renewToken)
    const authuser = await loggedIn(user)
    cookieSetter(res, accToken, renewToken)
    res.send({ status: 'login successful', user: authuser })
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

// REQUEST TO LOGOUT
router.delete('/api/logout', async (req, res) => {
  try {
    const decodedToken = await verifyRefreshTokenForLogout(req.cookies.renewToken)
    const userId = decodedToken.user.id
    const user = await getAppUser(userId)
    const refreshTokenlist = await getTokenList()
    const found = refreshTokenlist.find((refreshtoken) => refreshtoken.userId === user._id)

    if (!found) {
      res.clearCookie('renewToken')
      res.clearCookie('accToken')
      res.send({ status: 'logout successful' })
      return
    }

    await deleteRefreshToken(user._id)
    await loggedOut(user)

    res.clearCookie('accToken')
    res.clearCookie('renewToken')
    res.send({ status: 'logout successful' })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

module.exports = router

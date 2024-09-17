const jwt = require('jsonwebtoken')
const { signAccessToken, signRefreshToken } = require('../Utils/token.utils')
const { getAppUser } = require('../AppUser/appuser-service')
const { cookieSetter } = require('../Login/login-helper-ext')

const validateRefreshToken = (req, res) => {
  const key = process.env.REFRESH_TOKEN_KEY
  const refreshToken = req.cookies.renewToken
  if (!refreshToken) {
    throw new Error('token not found on request')
  }
  jwt.verify(refreshToken, key, async (err) => {
    if (err && err === 'jwt expired') {
      throw new Error('refresh token expired')
    }
    const userId = req.user.id
    const user = await getAppUser(userId)
    const accToken = signAccessToken(user)
    const renewToken = signRefreshToken(user)
    cookieSetter(res, accToken, renewToken)
    req.cookies.accToken = accToken
    req.cookies.renewToken = renewToken
  })
}

const validateToken = (req, res) => {
  const accessToken = req.cookies.accToken
  if (!accessToken) {
    throw new Error('token not found on request')
  }
  const key = process.env.ACCESS_TOKEN_KEY
  jwt.verify(accessToken, key, (err, decodedAccessToken) => {
    if (err && err.message === 'jwt expired') {
      return validateRefreshToken(req, res)
    }
    const { user } = decodedAccessToken
    req.user = user
    return req.user
  })
}

module.exports = { validateToken }

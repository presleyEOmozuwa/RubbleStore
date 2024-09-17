const jwt = require('jsonwebtoken')
const RefreshToken = require('../Models/refreshToken-model')
const { getRefreshToken, retrieveRefreshToken } = require('../Token/refreshToken-service')
const { OAuth2Client } = require('google-auth-library')
const { objCheckerOne } = require('./obj-checker-utils')

const signAccessToken = (user) => {
  const key = `${process.env.ACCESS_TOKEN_KEY}`
  const payload = {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  }
  const options = {
    issuer: 'Rubbles Tech',
    expiresIn: 5 * 60 * 60
  }

  return jwt.sign(payload, key, options)
}

const signRefreshToken = (user) => {
  const key = process.env.REFRESH_TOKEN_KEY
  const payload = {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  }
  const options = {
    issuer: 'Rubbles Tech',
    expiresIn: 24 * 60 * 60
  }

  return jwt.sign(payload, key, options)
}

const signRefreshTokenPlus = (user) => {
  const key = process.env.REFRESH_TOKEN_KEYPLUS
  const payload = {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  }
  const options = {
    issuer: 'Rubbles Tech',
    expiresIn: 24 * 60 * 60
  }

  return jwt.sign(payload, key, options)
}

const verifyRefreshTokenForLogout = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    if (!refreshToken) {
      throw new Error('token not found on request')
    }
    const key = process.env.REFRESH_TOKEN_KEY
    jwt.verify(refreshToken, key, (err, decodedToken) => {
      if (err && err.message === 'jwt expired') {
        throw new Error('refreshToken expired')
      }
      resolve(decodedToken)
    })
  })
}

const passwordResetToken = (user) => {
  const key = process.env.PASSWORD_RESET_TOKEN_KEY
  const payload = {
    userId: user._id,
    created: new Date()
  }
  const options = {
    issuer: 'Rubbles Tech',
    expiresIn: '1h'
  }

  return jwt.sign(payload, key, options)
}

const saveRefreshToken = async (user, token) => {
  const doc = await retrieveRefreshToken(user._id)
  doc.set({
    refreshtoken: token
  })
  const update = await doc.save()
  if (!update) {
    throw new Error('saving refresh token on db failed')
  }
}

const verifyGoogleToken = async (clientId, jwtToken) => {
  const client = new OAuth2Client(clientId)
  const ticket = await client.verifyIdToken({
    idToken: jwtToken,
    audience: clientId
  })
  const payload = ticket.getPayload()
  if (!payload || !payload.email_verified) {
    throw new Error('authentication failed')
  }

  return payload
}

const resetRefreshToken = async (user, requestToken) => {
  const doc = await retrieveRefreshToken(user._id)
  if (doc.refreshtoken === requestToken) {
    doc.set({
      refreshtoken: 'refresh token'
    })
    await doc.save()
  } else {
    throw new Error('refresh token do not match')
  }
}

const emailToken = (user) => {
  const key = process.env.EMAIL_TOKEN_KEY
  const payload = {
    userId: user._id,
    datecreated: new Date()
  }
  const options = {
    issuer: 'Rubbles Tech',
    expiresIn: '5h'
  }

  return jwt.sign(payload, key, options)
}

const refreshTokenStore = async (user) => {
  const doc = await getRefreshToken(user._id)
  if (doc) {
    console.log(doc)
  }
  const tokenStore = await RefreshToken.create({
    userId: user._id,
    email: user.email
  })

  if (!tokenStore || objCheckerOne(tokenStore) === 0) {
    throw new Error('refresh token store creation failed')
  }
  return tokenStore
}

module.exports = { signAccessToken, signRefreshToken, signRefreshTokenPlus, verifyRefreshTokenForLogout, passwordResetToken, saveRefreshToken, resetRefreshToken, verifyGoogleToken, emailToken, refreshTokenStore }

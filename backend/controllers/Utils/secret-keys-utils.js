const crypto = require('crypto')

const generateAccessTokenKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generateRefreshTokenKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generatepassWordResetKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generateEmailTokenKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}
const generateSessionSecret = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generatePasswordHashKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generateJWTokenKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generateRefreshTokenKeyPlus = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

const generateOTPKey = () => {
  crypto.randomBytes(128, (err, buf) => {
    if (err) throw err
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  })
}

module.exports = { generateAccessTokenKey, generateRefreshTokenKey, generateSessionSecret, generatepassWordResetKey, generateEmailTokenKey, generatePasswordHashKey, generateOTPKey, generateJWTokenKey, generateRefreshTokenKeyPlus }

const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getAppUser, getUserByEmail } = require('../AppUser/appuser-service')
const { passwordResetToken } = require('../Utils/token.utils')
const { emailSender } = require('../Utils/email-utils')

const verifyEmailTokens = async (token) => {
  if (!token) {
    throw new Error('no token payload found')
  }

  return new Promise((resolve, reject) => {
    const emailTokenKey = process.env.EMAIL_TOKEN_KEY
    jwt.verify(token, emailTokenKey, async (err, decodedToken) => {
      if (err && err.message === 'jwt_expired') {
        throw new Error('email token expired')
      }
      const userId = decodedToken.userId
      const user = await getAppUser(userId)
      user.set({
        confirmemail: 'true'
      })
      const confirmedUser = await user.save()
      resolve(confirmedUser)
    })
  })
}

const verifyPasswordResetTokens = async (token, password) => {
  return new Promise((resolve, reject) => {
    const passwordResetKey = process.env.PASSWORD_RESET_TOKEN_KEY
    jwt.verify(token, passwordResetKey, async (err, decodedToken) => {
      if (err && err.message === 'jwt_expired') {
        throw new Error('password reset token expired')
      }

      const userId = decodedToken.userId
      const user = await getAppUser(userId)
      const hashedPassword = await bcrypt.hash(password, 10)

      if (!hashedPassword) {
        throw new Error('password hashing failed')
      }

      user.set({
        password: hashedPassword
      })

      const userpasswordHashed = await user.save()
      resolve(userpasswordHashed)
    })
  })
}

const forgotPasswordService = async (email) => {
  if (!email) {
    throw new Error('please, provide your email')
  }

  const user = await getUserByEmail(email)
  const token = passwordResetToken(user)
  const clientUrl = `${process.env.LOAD_BALANCER_BASE_URL}/password/reset/${token}`

  const content = fs.readFileSync(path.join(__dirname, '../EmailTemplates/password-reset.html')).toString()

  const htmlContent = content.replace('[callBackUrl]', clientUrl)
  const contentData = htmlContent.replace('[toEmail]', user.email)

  const emailRequest = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: 'Password Reset Request',
    html: contentData
  }

  const result = await emailSender(emailRequest)

  if (!result) {
    throw new Error('Email sending failed')
  }

  return result
}

module.exports = { forgotPasswordService, verifyEmailTokens, verifyPasswordResetTokens }

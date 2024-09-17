const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const { emailToken } = require('./token.utils')

const emailSender = async (emailRequest) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
      }
    })

    const mailOptions = {
      from: emailRequest.from,
      to: emailRequest.to,
      subject: emailRequest.subject,
      html: emailRequest.html
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new Error('sending confirmation link failed')
      }
      resolve(info)
    })
  })
}

const sendEmailToUser = async (user) => {
  const token = emailToken(user._id)

  const clientUrl = `${process.env.LOAD_BALANCER_BASE_URL}/email/confirm/${token}`

  const content = fs.readFileSync(path.join(__dirname, '../EmailTemplates/email-confirm.html')).toString()

  const htmlContent = content.replace('[callBackUrl]', clientUrl)

  const emailRequest = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: 'Registration Successful',
    html: htmlContent
  }
  return await emailSender(emailRequest)
}

// SEND OTP TO USER AFTER SUCCESSFUL VERIFICATION
const sendOTPtoUser = async (user, otp) => {
  const content = fs.readFileSync(path.join(__dirname, '../EmailTemplates/2fa-otp.html')).toString()

  const htmlContent = content.replace('otp', otp)

  const emailRequest = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: 'Verification Code',
    html: htmlContent
  }
  const result = await emailSender(emailRequest)
  return result
}

module.exports = { sendEmailToUser, sendOTPtoUser, emailSender }

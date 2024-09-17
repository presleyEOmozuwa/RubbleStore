const bcrypt = require('bcryptjs')
const OldUserEmail = require('../Models/oldemail-model')

const saveOldEmail = async (user, currEmail) => {
  const doc = await OldUserEmail.findOne({ email: currEmail })

  if (doc) {
    throw new Error('you cannot use an old email, provide a new one')
  }

  await OldUserEmail.create({
    email: user.email
  })
}

const passwordChecker = async (user, oldPassword) => {
  const match = await bcrypt.compare(oldPassword, user.password)
  return match
}

const passwordHasher = async (newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  return hashedPassword
}

module.exports = { saveOldEmail, passwordChecker, passwordHasher }

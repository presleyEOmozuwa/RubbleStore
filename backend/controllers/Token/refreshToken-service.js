const RefreshToken = require('../Models/refreshToken-model')

const getTokenList = async () => {
  const tokenlist = await RefreshToken.find()
  if (!tokenlist) {
    throw new Error('refreshToken list request failed')
  }
  return tokenlist
}

const getRefreshToken = async (userId) => {
  const token = await RefreshToken.findOne({ userId })
  return token
}

const retrieveRefreshToken = async (userId) => {
  const doc = await RefreshToken.findOne({ userId })

  if (!doc) {
    throw new Error('refresh token document not found')
  }

  return doc
}

const deleteRefreshToken = async (userId) => {
  let isDeleted = false
  const doc = await retrieveRefreshToken(userId)
  await doc.deleteOne()
  isDeleted = true
  return isDeleted
}

module.exports = { getTokenList, getRefreshToken, retrieveRefreshToken, deleteRefreshToken }

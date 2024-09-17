const { SubArchive } = require('../Models/common-model')

const getSubArchive = async (userId) => {
  const subArchive = await SubArchive.findOne({ userId })
  return subArchive
}

const retrieveSubArchive = async (userId) => {
  const subArchive = await SubArchive.findOne({ userId })

  if (!subArchive) {
    throw new Error('order archive not found')
  }

  return subArchive
}

module.exports = { getSubArchive, retrieveSubArchive }

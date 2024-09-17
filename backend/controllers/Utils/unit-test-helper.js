const crypto = require('crypto')
const getTokenKey = async (num) => {
  const key = crypto.randomBytes(num)
  return key
}

module.exports = { getTokenKey }

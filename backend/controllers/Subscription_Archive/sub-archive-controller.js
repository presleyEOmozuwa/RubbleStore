const express = require('express')
const router = express.Router()
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveSubArchive } = require('./sub-archive-service')
const { validateToken } = require('../Token/tokenValidator')

router.get('/api/sub/history', async (req, res) => {
  try {
    validateToken(req, res)
    const userId = req.user.id
    const user = await getAppUser(userId)

    const subArchive = await retrieveSubArchive(user._id)

    res.send({ subArchive })
  } catch (err) {
    const { message } = err
    if (message === 'token not found on request' || message === 'refresh token expired') {
      res.status(401).send({ error: err.message })
      return
    }
    res.status(500).send({ error: err.message })
  }
})

module.exports = router

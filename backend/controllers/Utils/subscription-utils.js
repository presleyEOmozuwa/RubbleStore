const { Subscription } = require('../Models/common-model')
const { getSub } = require('../Subscription/subscription-service')
const { SubArchive } = require('../Models/common-model')
const { getSubArchive, retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service')
const { objCheckerOne } = require('./obj-checker-utils')

const assignSubscriptionToUser = async (user) => {
  const sub = await getSub(user._id)
  if (sub) {
    console.log(sub)
  }
  const createdSub = await Subscription.create({
    userId: user._id,
    email: user.email
  })

  if (!createdSub || objCheckerOne(createdSub) === 0) {
    throw new Error('subscription store creation failed')
  }
  return createdSub
}

const assignSubArchiveToUser = async (user) => {
  const subArchive = await getSubArchive(user._id)
  if (subArchive) {
    console.log(subArchive)
  }
  const createdSubArchive = await SubArchive.create({
    userId: user._id,
    email: user.email
  })

  if (!createdSubArchive || objCheckerOne(createdSubArchive) === 0) {
    throw new Error('subscription archive store creation failed')
  }
  return createdSubArchive
}

const addSubToSubArchive = async (user, updatedSub) => {
  const subArchive = await retrieveSubArchive(user._id)

  await SubArchive.findByIdAndUpdate(
    subArchive._id,
    { $push: { subscriptions: [updatedSub] } },
    { new: true }
  )
}

const addSubToOrder = async (subId, item) => {
  await Subscription.findByIdAndUpdate(
    subId,
    { $addToSet: { subItems: [item] } },
    { new: true }
  )
}

module.exports = { assignSubArchiveToUser, assignSubscriptionToUser, addSubToSubArchive, addSubToOrder }

const { retrieveSubArchive } = require('../Subscription_Archive/sub-archive-service')

const itemNameChecker = async (user, cartItems) => {
  let items

  const subArchive = await retrieveSubArchive(user._id)
  const { subNames } = subArchive

  if (subNames) {
    items = cartItems.filter((item) => {
      if (subNames.includes(item.prodName)) {
        return false
      } else {
        return true
      }
    })
  }

  if (items.length === 0) {
    throw new Error('you cannot subscribe to the same item twice')
  }

  return items
}

module.exports = { itemNameChecker }

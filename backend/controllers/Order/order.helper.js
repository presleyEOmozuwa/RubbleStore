const { shippingHandler } = require('../Shipping/shipping-service')
const { estimatedDateHandler } = require('../Utils/date-utils')
const { resetOrder } = require('./order-service')

const updateOrderShippingInfo = async (user, order) => {
  const trans = await shippingHandler()
  order.set({
    deliveryTrackingId: trans.tracker.id,
    deliveryTrackingUrl: trans.tracker.public_url,
    estimatedDeliveryDate: estimatedDateHandler(trans.selected_rate.est_delivery_days),
    deliveryStatus: trans.tracker.status
  })

  const updatedOrder = await order.save()

  if (!updatedOrder) {
    resetOrder(user)
    throw new Error('shipping order update failed')
  }

  return updatedOrder
}

module.exports = { updateOrderShippingInfo }

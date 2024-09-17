// const subProductOne = {
//   prodName: 'Learn React',
//   price: 15,
//   coupon: 0,
//   newPrice: 15,
//   priceId: 'learnReactId',
//   quantity: 1,
//   stockQty: 0,
//   typeOfItem: 'subscription',
//   categories: ['5c7f191e810c19729de860e3']
// }

// const subProductTwo = {
//   prodName: 'Learn Asp.NetCore',
//   price: 25,
//   coupon: 0,
//   newPrice: 25,
//   priceId: 'learnAspnetCoreId',
//   quantity: 1,
//   stockQty: 0,
//   typeOfItem: 'subscription',
//   categories: ['5c7f191e810c19729de860e3']
// }

const subscriptionlist = [
  {
    userId: null,
    email: 'wesleyomozuwa@gmail.com',
    stripecustomerid: 'stripeIdOne',
    subNumber: 'subnumber001',
    checkoutSessionId: 'ordersession001',
    currentPeriodStarts: 'current period starts',
    cardType: 'card type',
    last4: 'last 4 digits',
    tax: 0.00,
    paymentStatus: 'unpaid',
    orderTotal: 10.99,
    subItems: []
  },
  {
    userId: null,
    email: 'alexisomozuwa@gmail.com',
    stripecustomerid: 'stripeIdTwo',
    subNumber: 'subnumber002',
    checkoutSessionId: 'ordersession002',
    currentPeriodStarts: 'current period starts',
    cardType: 'card type',
    last4: 'last 4 digits',
    tax: 0.00,
    paymentStatus: 'unpaid',
    orderTotal: 10.99,
    subItems: []
  }
]

module.exports = { subscriptionlist }

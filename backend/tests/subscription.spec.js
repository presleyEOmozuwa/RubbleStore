const { getSub, retrieveSub, createSub, updateSub, resetSubOrder } = require('../controllers/Subscription/subscription-service')
const { Subscription } = require('../controllers/Models/common-model')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { three, five, seven } = require('../controllers/Utils/order-id-generator')
const { expect, it, beforeEach, describe } = require('@jest/globals')

jest.mock('stripe', () => {
  return () => ({
    checkout: {
      sessions: {
        retrieve: jest.fn().mockImplementationOnce(() => Promise.resolve({ invoice: 'mockInvoiceId', total_details: { amount_tax: 200 }, payment_status: 'paid', amount_total: 5000 }))
      }
    },
    invoices: {
      retrieve: jest.fn().mockImplementationOnce(() => Promise.resolve({ payment_intent: 'mockPaymentIntentId' }))
    },
    paymentIntents: {
      retrieve: jest.fn().mockImplementationOnce(() => Promise.resolve({ latest_charge: 'mockChargeId' }))
    },
    charges: {
      retrieve: jest.fn().mockImplementationOnce(() => Promise.resolve({ payment_method_details: { card: { brand: 'Visa', last4: '1234' } } }))
    }
  })
})

// Mock the dependencies
jest.mock('stripe')
jest.mock('../controllers/Models/common-model')
jest.mock('../controllers/Utils/order-id-generator')

// jest.mock('../controllers/Utils/order-id-generator', () => ({
//   three: jest.fn(),
//   five: jest.fn(),
//   seven: jest.fn()
// }))

describe('Subscription Service Tests', () => {
  const mockUserId = 'mockUserId'
  const mockUser = { _id: mockUserId, stripecustomerid: 'mockStripeCustomerId' }
  const mockCheckoutSession = { id: 'mockCheckoutSessionId' }
  const mockSub = {
    set: jest.fn(),
    save: jest.fn().mockResolvedValue('savedSub')
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSub', () => {
    it('should return the subscription for a valid userId', async () => {
      const mockSub = { _id: 'sub123', userId: 'user123', subItems: [{}, {}] }
      Subscription.findOne.mockResolvedValue(mockSub)
      const result = await getSub({ userId: mockSub.userId })
      // expect(Subscription.findOne).toHaveBeenCalledWith({ mockUserId })
      expect(result).toEqual(mockSub)
    })
  })

  describe('retrieveSub', () => {
    it('should return the subscription if found', async () => {
      Subscription.findOne.mockResolvedValue(mockSub)

      const result = await retrieveSub(mockUserId)

      expect(Subscription.findOne).toHaveBeenCalledWith({ userId: mockUserId })
      expect(result).toBe(mockSub)
    })

    it('should throw an error if subscription is not found', async () => {
      Subscription.findOne.mockResolvedValue(null)

      await expect(retrieveSub(mockUserId)).rejects.toThrow('subscription not found')
    })
  })

  describe('createSub', () => {
    it('should create a new subscription for the user', async () => {
      Subscription.findOne.mockResolvedValue(mockSub)
      three.mockReturnValue('111')
      five.mockReturnValue('222')
      seven.mockReturnValue('333')

      const result = await createSub(mockUser, mockCheckoutSession)

      // expect(retrieveSub).toHaveBeenCalledWith(mockUser._id)
      // expect(mockSub.set).toHaveBeenCalledWith({
      //   checkoutSessionId: mockCheckoutSession.id,
      //   subNumber: '#546-62517-7131146'
      // })
      expect(mockSub.save).toHaveBeenCalled()
      expect(result).toBe('savedSub')
    })
  })

  describe('updateSub', () => {
    it('should update the subscription with Stripe details', async () => {
      const mockSession = { invoice: 'mockInvoiceId', total_details: { amount_tax: 200 }, payment_status: 'paid', amount_total: 5000 }
      const mockInvoice = { payment_intent: 'mockPaymentIntentId' }
      const mockPaymentIntent = { latest_charge: 'mockChargeId' }
      const mockCharge = { payment_method_details: { card: { brand: 'Visa', last4: '1234' } } }

      Subscription.findOne.mockResolvedValue(mockSub)
      stripe.checkout.sessions.retrieve.mockResolvedValue(mockSession)
      stripe.invoices.retrieve.mockResolvedValue(mockInvoice)
      stripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent)
      stripe.charges.retrieve.mockResolvedValue(mockCharge)

      const result = await updateSub(mockUser, mockCheckoutSession.id)

      // expect(retrieveSub).toHaveBeenCalledWith(mockUser._id)
      expect(mockSub.set).toHaveBeenCalledWith({
        stripecustomerid: mockUser.stripecustomerid,
        cardType: 'Visa',
        last4: '1234',
        tax: 200,
        paymentStatus: 'paid',
        orderTotal: 50
      })
      expect(mockSub.save).toHaveBeenCalled()
      expect(result).toBe('savedSub')
    })
  })

  describe('resetSubOrder', () => {
    it('should reset the subscription order fields', async () => {
      Subscription.findOne.mockResolvedValue(mockSub)
      await resetSubOrder(mockUser)

      // expect(retrieveSub).toHaveBeenCalledWith(mockUser._id)
      expect(mockSub.set).toHaveBeenCalledWith({
        stripecustomerid: 'stripe customer id',
        subNumber: 'subscription unique identifier',
        checkoutSessionId: 'checkout session id',
        currentPeriodStarts: 'current period starts',
        paymentStatus: 'unpaid',
        cardType: 'card type',
        last4: 'last 4 digits',
        tax: 0,
        orderTotal: 10.99,
        subItems: []
      })
      expect(mockSub.save).toHaveBeenCalled()
    })
  })
})

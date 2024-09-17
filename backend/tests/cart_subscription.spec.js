// subCart.test.js
const { getSubCart, retrieveSubCart, retrieveSubCartPlus } = require('../controllers/Cart_Subscription_Items/subcart-service')
const { SubCart } = require('../controllers/Models/common-model')
const { expect, it, afterEach, describe } = require('@jest/globals')

// Mock the SubCart model
jest.mock('../controllers/Models/common-model', () => ({
  SubCart: {
    findOne: jest.fn()
  }
}))

describe('SubCart functions', () => {
  const mockUserId = 'mockUserId'
  const mockUser = { _id: mockUserId }
  const mockSubCart = { userId: mockUserId, subItems: ['item1', 'item2'] }

  afterEach(() => {
    jest.clearAllMocks() // Clear mocks after each test to avoid interference between tests
  })

  describe('getSubCart', () => {
    it('should return subcart when found', async () => {
      SubCart.findOne.mockResolvedValue(mockSubCart)

      const result = await getSubCart(mockUser)

      expect(SubCart.findOne).toHaveBeenCalledWith({ userId: mockUserId })
      expect(result).toEqual(mockSubCart)
    })

    it('should return null when subcart not found', async () => {
      SubCart.findOne.mockResolvedValue(null)

      const result = await getSubCart(mockUser)

      expect(SubCart.findOne).toHaveBeenCalledWith({ userId: mockUserId })
      expect(result).toBeNull()
    })
  })

  describe('retrieveSubCart', () => {
    it('should return subcart when found', async () => {
      SubCart.findOne.mockResolvedValue(mockSubCart)

      const result = await retrieveSubCart(mockUserId)

      expect(SubCart.findOne).toHaveBeenCalledWith({ userId: mockUserId })
      expect(result).toEqual(mockSubCart)
    })

    it('should throw an error when subcart not found', async () => {
      SubCart.findOne.mockResolvedValue(null)

      await expect(retrieveSubCart(mockUserId)).rejects.toThrow('subcart not found')
      expect(SubCart.findOne).toHaveBeenCalledWith({ userId: mockUserId })
    })
  })

  describe('retrieveSubCartPlus', () => {
    it('should return subcart with populated subItems when found', async () => {
      // Mock the populate method
      const mockPopulate = jest.fn().mockResolvedValue(mockSubCart)
      SubCart.findOne.mockReturnValue({ populate: mockPopulate })

      const result = await retrieveSubCartPlus(mockUserId)

      expect(SubCart.findOne).toHaveBeenCalledWith({ userId: mockUserId })
      expect(mockPopulate).toHaveBeenCalledWith('subItems')
      expect(result).toEqual(mockSubCart)
    })

    it('should throw an error when subcart not found', async () => {
      SubCart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) })

      await expect(retrieveSubCartPlus(mockUserId)).rejects.toThrow('subcart not found')
      expect(SubCart.findOne).toHaveBeenCalledWith({ userId: mockUserId })
    })
  })
})

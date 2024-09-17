const { OrderArchive } = require('../controllers/Models/common-model')
const { getOrderArchive, retrieveOrderArchive } = require('../controllers/Order_Archive/order-archive-service')
const { expect, it, afterEach, describe } = require('@jest/globals')

// Mock the OrderArchive model
jest.mock('../controllers/Models/common-model')

describe('Order Archive Functions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getOrderArchive', () => {
    it('should return the order archive when found', async () => {
      // Arrange
      const userId = 'user123'
      const mockArchive = { userId, orders: [] }
      OrderArchive.findOne.mockResolvedValue(mockArchive)

      // Act
      const result = await getOrderArchive(userId)

      // Assert
      expect(OrderArchive.findOne).toHaveBeenCalledWith({ userId })
      expect(result).toEqual(mockArchive)
    })

    it('should return null if no order archive is found', async () => {
      // Arrange
      const userId = 'user123'
      OrderArchive.findOne.mockResolvedValue(null)

      // Act
      const result = await getOrderArchive(userId)

      // Assert
      expect(OrderArchive.findOne).toHaveBeenCalledWith({ userId })
      expect(result).toBeNull()
    })
  })

  describe('retrieveOrderArchive', () => {
    it('should return the order archive when found', async () => {
      // Arrange
      const userId = 'user123'
      const mockArchive = { userId, orders: [] }
      OrderArchive.findOne.mockResolvedValue(mockArchive)

      // Act
      const result = await retrieveOrderArchive(userId)

      // Assert
      expect(OrderArchive.findOne).toHaveBeenCalledWith({ userId })
      expect(result).toEqual(mockArchive)
    })

    it('should throw an error if no order archive is found', async () => {
      // Arrange
      const userId = 'user123'
      OrderArchive.findOne.mockResolvedValue(null)

      // Act & Assert
      await expect(retrieveOrderArchive(userId)).rejects.toThrow('order archive not found')
      expect(OrderArchive.findOne).toHaveBeenCalledWith({ userId })
    })
  })
})

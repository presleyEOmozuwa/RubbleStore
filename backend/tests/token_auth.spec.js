const RefreshToken = require('../controllers/Models/refreshToken-model')
const { getTokenList, getRefreshToken, retrieveRefreshToken, deleteRefreshToken } = require('../controllers/Token/refreshToken-service')
const { expect, it, afterEach, describe } = require('@jest/globals')

jest.mock('../controllers/Models/refreshToken-model')

describe('RefreshToken Service Functions', () => {
  afterEach(() => {
    jest.clearAllMocks() // Clear mock data after each test
  })

  describe('getTokenList', () => {
    it('should return the token list successfully', async () => {
      const mockTokens = [{ userId: '1' }, { userId: '2' }]
      RefreshToken.find.mockResolvedValue(mockTokens)

      const result = await getTokenList()
      expect(result).toEqual(mockTokens)
      expect(RefreshToken.find).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if the token list retrieval fails', async () => {
      RefreshToken.find.mockResolvedValue(null)

      await expect(getTokenList()).rejects.toThrow('refreshToken list request failed')
      expect(RefreshToken.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('getRefreshToken', () => {
    it('should return a refresh token by userId', async () => {
      const mockToken = { userId: '1', token: 'someToken' }
      RefreshToken.findOne.mockResolvedValue(mockToken)

      const result = await getRefreshToken('1')
      expect(result).toEqual(mockToken)
      expect(RefreshToken.findOne).toHaveBeenCalledWith({ userId: '1' })
      expect(RefreshToken.findOne).toHaveBeenCalledTimes(1)
    })

    it('should return null if no refresh token is found', async () => {
      RefreshToken.findOne.mockResolvedValue(null)

      const result = await getRefreshToken('1')
      expect(result).toBeNull()
      expect(RefreshToken.findOne).toHaveBeenCalledWith({ userId: '1' })
      expect(RefreshToken.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('retrieveRefreshToken', () => {
    it('should return a refresh token document by userId', async () => {
      const mockDoc = { userId: '1', token: 'someToken' }
      RefreshToken.findOne.mockResolvedValue(mockDoc)

      const result = await retrieveRefreshToken('1')
      expect(result).toEqual(mockDoc)
      expect(RefreshToken.findOne).toHaveBeenCalledWith({ userId: '1' })
      expect(RefreshToken.findOne).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if the refresh token document is not found', async () => {
      RefreshToken.findOne.mockResolvedValue(null)

      await expect(retrieveRefreshToken('1')).rejects.toThrow('refresh token document not found')
      expect(RefreshToken.findOne).toHaveBeenCalledWith({ userId: '1' })
      expect(RefreshToken.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteRefreshToken', () => {
    it('should delete a refresh token by userId successfully', async () => {
      const mockDoc = {
        userId: '1',
        deleteOne: jest.fn().mockResolvedValue(true)
      }
      RefreshToken.findOne.mockResolvedValue(mockDoc)

      const result = await deleteRefreshToken('1')
      expect(result).toBe(true)
      expect(mockDoc.deleteOne).toHaveBeenCalledTimes(1)
      expect(RefreshToken.findOne).toHaveBeenCalledWith({ userId: '1' })
      expect(RefreshToken.findOne).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if trying to delete a refresh token that does not exist', async () => {
      RefreshToken.findOne.mockResolvedValue(null)

      await expect(deleteRefreshToken('1')).rejects.toThrow('refresh token document not found')
      expect(RefreshToken.findOne).toHaveBeenCalledWith({ userId: '1' })
      expect(RefreshToken.findOne).toHaveBeenCalledTimes(1)
    })
  })
})

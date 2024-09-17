// Import necessary modules
const { getSubArchive, retrieveSubArchive } = require('../controllers/Subscription_Archive/sub-archive-service')
const { SubArchive } = require('../controllers/Models/common-model')
const { expect, it, afterEach, describe } = require('@jest/globals')

// Mock the SubArchive model
jest.mock('../controllers/Models/common-model')

describe('getSubArchive', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return the subArchive when found', async () => {
    const userId = '12345'
    const mockSubArchive = { userId, data: 'some data' }

    // Mock the findOne method to return a value
    SubArchive.findOne.mockResolvedValue(mockSubArchive)

    const result = await getSubArchive(userId)

    expect(SubArchive.findOne).toHaveBeenCalledWith({ userId })
    expect(result).toEqual(mockSubArchive)
  })

  it('should return null when no subArchive is found', async () => {
    const userId = '12345'

    // Mock the findOne method to return null
    SubArchive.findOne.mockResolvedValue(null)

    const result = await getSubArchive(userId)

    expect(SubArchive.findOne).toHaveBeenCalledWith({ userId })
    expect(result).toBeNull()
  })
})

describe('retrieveSubArchive', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return the subArchive when found', async () => {
    const userId = '12345'
    const mockSubArchive = { userId, data: 'some data' }

    // Mock the findOne method to return a value
    SubArchive.findOne.mockResolvedValue(mockSubArchive)

    const result = await retrieveSubArchive(userId)

    expect(SubArchive.findOne).toHaveBeenCalledWith({ userId })
    expect(result).toEqual(mockSubArchive)
  })

  it('should throw an error when no subArchive is found', async () => {
    const userId = '12345'

    // Mock the findOne method to return null
    SubArchive.findOne.mockResolvedValue(null)

    await expect(retrieveSubArchive(userId)).rejects.toThrow('order archive not found')

    expect(SubArchive.findOne).toHaveBeenCalledWith({ userId })
  })
})

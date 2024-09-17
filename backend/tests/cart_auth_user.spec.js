const { getCart, retrieveCart, retrieveCartPlus } = require('../controllers/Cart_AuthUser/cart-service')
const { Cart } = require('../controllers/Models/common-model')
const { expect, it, describe } = require('@jest/globals')

jest.mock('../controllers/Models/common-model')

describe('getCart', () => {
  it('should return the cart if found', async () => {
    const mockCart = { userId: '123', items: [] }
    Cart.findOne.mockResolvedValue(mockCart)

    const user = { _id: '123' }
    const result = await getCart(user)

    expect(result).toEqual(mockCart)
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: '123' })
  })

  it('should return null if no cart is found', async () => {
    Cart.findOne.mockResolvedValue(null)

    const user = { _id: '123' }
    const result = await getCart(user)

    expect(result).toBeNull()
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: '123' })
  })
})

describe('retrieveCart', () => {
  it('should return the cart if found', async () => {
    const mockCart = { userId: '123', items: [] }
    Cart.findOne.mockResolvedValue(mockCart)

    const result = await retrieveCart('123')

    expect(result).toEqual(mockCart)
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: '123' })
  })

  it('should throw an error if the cart is not found', async () => {
    Cart.findOne.mockResolvedValue(null)
    await expect(retrieveCart('123')).rejects.toThrow('cart not found')
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: '123' })
  })
})

describe('retrieveCartPlus', () => {
  it('should return the populated cart if found', async () => {
    const mockCart = { userId: '123', items: [], products: [] }
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCart) })

    const result = await retrieveCartPlus('123')

    expect(result).toEqual(mockCart)
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: '123' })
  })

  it('should throw an error if the populated cart is not found', async () => {
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) })

    await expect(retrieveCartPlus('123')).rejects.toThrow('cart not found')
    expect(Cart.findOne).toHaveBeenCalledWith({ userId: '123' })
  })
})

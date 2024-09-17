const { Product } = require('../controllers/Models/common-model')
const { expect, it, describe } = require('@jest/globals')
const {
  getProductlist,
  getSubProducts,
  getProduct,
  getProductWithCategories,
  createProduct,
  upDateProduct,
  deleteProduct
} = require('../controllers/Product/product-service')

jest.mock('../controllers/Models/common-model')

describe('Product Service', () => {
  describe('getProductlist', () => {
    it('should return products with valid count and page', async () => {
      const mockProducts = [{}, {}] // Mocked products
      Product.find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockProducts)
      })

      const result = await getProductlist(1, 2)
      expect(result).toEqual(mockProducts)
    })

    it('should throw an error if count or page is missing', async () => {
      await expect(getProductlist(null)).rejects.toThrow('missing query parameters')
    })

    it('should throw an error if count or page is not a number', async () => {
      await expect(getProductlist('invalid', 'invalid')).rejects.toThrow('invalid value for query parameters')
    })

    it('should throw an error if count is zero or negative', async () => {
      await expect(getProductlist(-1, 2)).rejects.toThrow('query parameters cannot be negative values')
    })
  })

  describe('getSubProducts', () => {
    it('should return subscription products', async () => {
      const mockProducts = [{}, {}]
      Product.find.mockResolvedValue(mockProducts)

      const result = await getSubProducts()
      expect(result).toEqual(mockProducts)
    })

    it('should throw an error if products not found', async () => {
      Product.find.mockResolvedValue(null)
      await expect(getSubProducts()).rejects.toThrow('product list request failed')
    })
  })

  describe('getProduct', () => {
    it('should return a product with a valid productId', async () => {
      const mockProduct = { _id: 'productId', prodName: 'Mattress' }
      Product.findOne.mockResolvedValue(mockProduct)
      const result = await getProduct('productId')
      expect(result).toEqual(mockProduct)
    })

    it('should throw an error if product not found', async () => {
      Product.findOne.mockResolvedValue(null)
      await expect(getProduct('productId')).rejects.toThrow('product not found')
    })
  })

  describe('getProductWithCategories', () => {
    it('should return a product with categories', async () => {
      const mockProduct = { categories: [] }
      Product.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProduct)
      })

      const result = await getProductWithCategories('valid-id')
      expect(result).toEqual(mockProduct)
    })

    it('should throw an error if product not found', async () => {
      Product.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      })
      await expect(getProductWithCategories('productId')).rejects.toThrow('product not found')
    })
  })

  describe('createProduct', () => {
    it('should create a new product with valid payload', async () => {
      const mockProduct = {}
      Product.create.mockResolvedValue(mockProduct)

      const payload = {
        prodName: 'Product',
        price: 100,
        coupon: 10,
        priceId: 'price_123',
        stockQty: 5,
        des: 'Description',
        imageUrl: 'http://image.url',
        typeOfItem: 'regular'
      }

      const result = await createProduct(payload)
      expect(result.product).toEqual(mockProduct)
    })

    it('should throw an error if payload is missing', async () => {
      await expect(createProduct()).rejects.toThrow('please provide required fields')
    })
  })

  describe('upDateProduct', () => {
    it('should update a product with valid payload', async () => {
      const mockProduct = {
        set: jest.fn(),
        save: jest.fn().mockResolvedValue({})
      }
      Product.findOne.mockResolvedValue(mockProduct)
      const payload = {
        id: 'valid-id',
        prodName: 'Updated Product',
        price: 150,
        coupon: 5,
        priceId: 'price_456',
        des: 'Updated Description',
        stockQty: 10,
        imageUrl: 'http://new-image.url',
        typeOfItem: 'regular'
      }

      const result = await upDateProduct(payload)
      expect(result.upDatedProduct).toEqual({})
    })

    it('should throw an error if payload is missing', async () => {
      await expect(upDateProduct()).rejects.toThrow('product edit data not found on request')
    })
  })

  describe('deleteProduct', () => {
    it('should delete a product with valid productId', async () => {
      const mockProduct = {
        newPrice: 'NaN',
        save: jest.fn(),
        set: jest.fn().mockResolvedValue(true)
      }
      const mockResult = { acknowledged: true, deletedCount: 1 }
      const mockOutput = {
        deletedItem: mockProduct,
        isDeleted: true,
        result: { acknowledged: mockResult.acknowledged, deletedCount: mockResult.deletedCount }
      }
      Product.find.mockResolvedValue(mockProduct)
      Product.deleteOne.mockResolvedValue(mockResult)
      const output = await deleteProduct('productId')
      expect(output.isDeleted).toBe(mockOutput.isDeleted)
      expect(output.result).toStrictEqual(mockOutput.result)
      expect(output.deletedItem.newPrice).toBe(mockOutput.deletedItem.newPrice)
      // expect(output.deletedItem.save).toBeInstanceOf(Function);
      // expect(output.deletedItem.set).toBeInstanceOf(Function);
    })

    // it('should throw an error if product not found', async () => {
    //   Product.find.mockResolvedValue(null);
    //   await expect(deleteProduct('productId')).rejects.toThrow('product not found');
    // });
  })
})

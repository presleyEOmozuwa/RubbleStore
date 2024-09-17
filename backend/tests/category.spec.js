// __tests__/category.test.js
const { Category } = require('../controllers/Models/common-model')
const { expect, it, describe } = require('@jest/globals')
const {
  createCategory,
  getCategoryList,
  getCategory,
  getCategoryByName,
  upDateCategory,
  deleteCategory
} = require('../controllers/Category/category-service')

jest.mock('../controllers/Models/common-model')

// Mock the Category model
// jest.mock('../controllers/Models/common-model', () => ({
//   Category: {
//     create: jest.fn(),
//     find: jest.fn(),
//     findOne: jest.fn(),
//     save: jest.fn(),
//     deleteOne: jest.fn(),
//   }
// }));

describe('Category Service Tests', () => {
  // CREATE CATEGORY
  it('should create a category', async () => {
    const mockCategory = { catName: 'Electronics', description: 'All electronic items' }
    Category.create.mockResolvedValue(mockCategory)

    const result = await createCategory(mockCategory)
    expect(result).toEqual(mockCategory)
    expect(Category.create).toHaveBeenCalledWith(mockCategory)
  })

  it('should throw an error if category creation fails', async () => {
    Category.create.mockResolvedValue(null)

    await expect(createCategory({ catName: 'Books', description: 'All books' }))
      .rejects
      .toThrow('category creation failed')
  })

  // GET ALL LIST OF CATEGORIES WITH [ASSOCIATED PRODUCTS INCLUDED]
  it('should get all categories', async () => {
    const mockCategoryList = [{ catName: 'Books', description: 'All books' }]
    Category.find.mockResolvedValue(mockCategoryList)

    const result = await getCategoryList()
    expect(result).toEqual(mockCategoryList)
    expect(Category.find).toHaveBeenCalled()
  })

  it('should throw an error if fetching category list fails', async () => {
    Category.find.mockResolvedValue(null)

    await expect(getCategoryList())
      .rejects
      .toThrow('category list request failed')
  })

  // GET CATEGORY BY ID
  it('should get a category by ID', async () => {
    const mockCategory = { _id: '123', catName: 'Books', description: 'All books' }
    Category.findOne.mockResolvedValue(mockCategory)

    const result = await getCategory('123')
    expect(result).toEqual(mockCategory)
    expect(Category.findOne).toHaveBeenCalledWith({ _id: '123' })
  })

  it('should throw an error if category by ID request fails', async () => {
    Category.findOne.mockResolvedValue(null)

    await expect(getCategory('123'))
      .rejects
      .toThrow('category by id request failed')
  })

  // GET CATEGORY BY NAME
  it('should return the category when found', async () => {
    const mockCategory = { catName: 'Electronics', description: 'All kinds of electronics' }

    Category.findOne.mockResolvedValue(mockCategory)

    const result = await getCategoryByName('Electronics')

    expect(Category.findOne).toHaveBeenCalledWith({ catName: 'Electronics' })
    expect(result).toEqual(mockCategory)
  })

  it('should throw an error when the category is not found', async () => {
    Category.findOne.mockResolvedValue(null)
    await expect(getCategoryByName('NonExistentCategory')).rejects.toThrow('categoryByName request failed')
    expect(Category.findOne).toHaveBeenCalledWith({ catName: 'NonExistentCategory' })
  })

  it('should update the category description and return the updated category', async () => {
    const mockCategory = {
      catName: 'Electronics',
      description: 'Old Description',
      set: jest.fn(),
      save: jest.fn().mockResolvedValue({ catName: 'Electronics', description: 'New Description' })
    }

    Category.findOne.mockResolvedValue(mockCategory)

    const payload = { catName: 'Electronics', description: 'New Description' }

    const result = await upDateCategory(payload)

    expect(Category.findOne).toHaveBeenCalledWith({ catName: 'Electronics' })
    expect(mockCategory.set).toHaveBeenCalledWith({ description: 'New Description' })
    expect(mockCategory.save).toHaveBeenCalled()
    expect(result).toEqual({ catName: 'Electronics', description: 'New Description' })
  })

  it('should throw an error if the category update fails', async () => {
    const mockCategory = {
      catName: 'Electronics',
      description: 'Old Description',
      set: jest.fn(),
      save: jest.fn().mockResolvedValue(null)
    }

    Category.findOne.mockResolvedValue(mockCategory)

    const payload = { catName: 'Electronics', description: 'New Description' }

    await expect(upDateCategory(payload)).rejects.toThrow('category update failed')

    expect(Category.findOne).toHaveBeenCalledWith({ catName: 'Electronics' })
    expect(mockCategory.set).toHaveBeenCalledWith({ description: 'New Description' })
    expect(mockCategory.save).toHaveBeenCalled()
  })

  // DELETE CATEGORY
  it('should delete a category', async () => {
    const mockCategory = { _id: '123', catName: 'Books', description: 'All books' }
    const mockResult = { acknowledged: true, deletedCount: 1 }
    Category.findOne.mockResolvedValue(mockCategory)
    Category.deleteOne.mockResolvedValue(mockResult)
    const output = await deleteCategory('123')
    expect(output).toEqual({ deletedCategory: mockCategory, isDeleted: true, result: { acknowledged: mockResult.acknowledged, deletedCount: mockResult.deletedCount } })
    // expect(mockCategory.deleteOne).toHaveBeenCalled();
  })

  it('should throw an error if delete category fails', async () => {
    Category.findOne.mockResolvedValue(null)

    await expect(deleteCategory('123'))
      .rejects
      .toThrow('category by id request failed')
  })
})

describe('upDateCategory', () => {

})

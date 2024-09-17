const { Category } = require('../Models/common-model')

// CREATE CATEGORY
const createCategory = async (payload) => {
  const category = await Category.create({
    catName: payload.catName,
    description: payload.description
  })

  if (!category) {
    throw new Error('category creation failed')
  }

  return category
}

// GET ALL LIST OF CATEGORIES WITH [ASSOCIATED PRODUCTS INCLUDED]
const getCategoryList = async () => {
  const categorylist = await Category.find()

  if (!categorylist) {
    throw new Error('category list request failed')
  }
  return categorylist
}

const getCategoryArray = async () => {
  const categoryArray = await Category.find()

  if (!categoryArray) {
    throw new Error('category array request failed')
  }
  return categoryArray
}

// GET CATEGORY BY ID
const getCategory = async (categoryId) => {
  const category = await Category.findOne({ _id: categoryId })

  if (!category) {
    throw new Error('category by id request failed')
  }

  return category
}

// GET CATEGORY BY NAME
const getCategoryByName = async (catname) => {
  const categoryByName = await Category.findOne({ catName: catname })
  if (!categoryByName) {
    throw new Error('categoryByName request failed')
  }

  return categoryByName
}

// UPDATE  CATEGORY
const upDateCategory = async (payload) => {
  const category = await getCategoryByName(payload.catName)
  category.set({
    description: payload.description
  })

  const upDatedCategory = await category.save()

  if (!upDatedCategory) {
    throw new Error('category update failed')
  }

  return upDatedCategory
}

// DELETE CATEGORY
// const deleteCategory = async (categoryId) => {
//   const con = {}
//   const category = await getCategory(categoryId)
//   await category.deleteOne()
//   con.deletedCategory = category
//   con.isDeleted = true
//   return con
// }

const deleteCategory = async (categoryId) => {
  const con = { }
  const category = await getCategory(categoryId)
  const result = await Category.deleteOne(category)
  const { acknowledged, deletedCount } = result
  con.deletedCategory = category
  con.isDeleted = true
  con.result = { acknowledged, deletedCount }
  return con
}

module.exports = { getCategoryList, getCategoryArray, getCategory, getCategoryByName, upDateCategory, deleteCategory, createCategory }

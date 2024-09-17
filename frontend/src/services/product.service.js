import axios from 'axios'

export const getAllProducts = async (url) => {
  const response = await axios.get(url)
  return response
}

export const getFilteredProducts = async (url) => {
  const response = await axios.get(url)
  return response
}

export const getProduct = async (url) => {
  const response = await axios.get(url)
  return response
}

export const getProductInfo = async (url) => {
  const response = await axios.get(url)
  return response
}

export const getSubProducts = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const getProductWithCategories = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const addItemToCart = async (url, payload) => {
  const response = await axios.post(url, payload, { withCredentials: true })
  return response
}

export const getCartItems = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const createProduct = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.post(url, payload, { withCredentials: true })
  }
  return response
}

export const updateProduct = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.put(url, payload, { withCredentials: true })
  }
  return response
}

export const deleteProduct = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

export const deleteCartItem = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

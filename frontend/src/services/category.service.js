import axios from 'axios'

export const getAllCategories = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const getCategory = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const createCategory = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.post(url, payload, { withCredentials: true })
  }
  return response
}

export const updateCategory = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.put(url, payload, { withCredentials: true })
  }
  return response
}

export const deleteCategory = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

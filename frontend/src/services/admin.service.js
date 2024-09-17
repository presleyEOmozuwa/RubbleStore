import axios from 'axios'

export const getUserByAdmin = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const registerUserByAdmin = async (url, payload, option) => {
  let response
  if (typeof payload === 'object' || typeof option === 'object') {
    response = await axios.post(url, payload, option)
  }
  return response
}

export const updateUserByAdmin = async (url, payload) => {
  let response
  if (typeof payload === 'object' || typeof option === 'object') {
    response = await axios.put(url, payload, { withCredentials: true })
  }
  return response
}

export const blockHandler = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const unblockHandler = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const clearHandler = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

export const clearOrderArchive = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

export const locationHandler = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

export const deleteUserByAdmin = async (url) => {
  const response = await axios.delete(url, { withCredentials: true })
  return response
}

import axios from 'axios'

export const getOrders = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const getOrder = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

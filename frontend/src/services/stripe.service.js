import axios from 'axios'

export const manageBillingHandler = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const checkoutSuccessMultiple = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const checkoutFailureMultipleHandler = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const checkoutFailureSingleHandler = async (url) => {
  const response = await axios.get(url, { withCredentials: true })
  return response
}

export const regularSingleHistory = async (url, option) => {
  let response
  if (typeof option === 'object') {
    response = await axios.get(url, option)
  }
  return response
}

export const regularMultipleHistory = async (url, option) => {
  let response
  if (typeof option === 'object') {
    response = await axios.get(url, option)
  }
  return response
}

export const singleSubHistory = async (url, option) => {
  let response
  if (typeof option === 'object') {
    response = await axios.get(url, option)
  }
  return response
}

export const multipleSubHistory = async (url) => {
  let response
  if (typeof option === 'object') {
    response = await axios.get(url, { withCredentials: true })
  }
  return response
}

export const singleRegularHandler = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.post(url, payload, { withCredentials: true })
  }
  return response
}

export const singleSubHandler = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.post(url, payload, { withCredentials: true })
  }
  return response
}

export const multipleRegularHandler = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.post(url, payload, { withCredentials: true })
  }
  return response
}

export const multipleSubHandler = async (url, payload) => {
  let response
  if (typeof payload === 'object') {
    response = await axios.post(url, payload, { withCredentials: true })
  }
  return response
}

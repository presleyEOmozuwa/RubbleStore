import axios from 'axios'

export const emailConfirmHandler = async (url, option) => {
  let response
  if (typeof option === 'object') {
    response = await axios.post(url, option)
  }
  return response
}

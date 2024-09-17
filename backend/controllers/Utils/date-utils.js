const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

const generateDate = () => {
  const orderdate = new Date().toLocaleDateString('en-US', options)
  return orderdate
}

const timeStampConverter = (timestamps) => {
  const date = new Date(timestamps)
  const format = date.toLocaleDateString('en-US', options)
  return format
}

const estimatedDateHandler = (numberOfDays) => {
  const date = new Date()
  date.setDate(date.getDate() + numberOfDays)
  const format = date.toLocaleDateString('en-US', options)
  return format
}

module.exports = { generateDate, estimatedDateHandler, timeStampConverter }

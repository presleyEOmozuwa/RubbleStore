const three = () => {
  let result = ''
  for (let i = 0; i < 3; i++) {
    result += `${Math.floor(Math.random() * 9)}`
  }
  return result
}
const five = () => {
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += `${Math.floor(Math.random() * 9)}`
  }
  return result
}
const seven = () => {
  let result = ''
  for (let i = 0; i < 7; i++) {
    result += `${Math.floor(Math.random() * 9)}`
  }
  return result
}

module.exports = { three, five, seven }

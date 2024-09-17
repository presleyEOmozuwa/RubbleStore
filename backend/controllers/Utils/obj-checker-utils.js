const objCheckerOne = (obj) => {
  let num
  const arr = Object.values(obj)
  if (arr.length <= 0) {
    num = 0
  }
  return num
}

const objCheckerTwo = (obj) => {
  let num
  const arr = Object.values(obj)
  if (arr.length > 0) {
    num = arr.length
  }
  return num
}

module.exports = { objCheckerOne, objCheckerTwo }

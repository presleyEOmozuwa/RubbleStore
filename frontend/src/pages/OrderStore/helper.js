export const totalBeforeTax = (orderTotal, shipping) => {
  let total
  if (typeof orderTotal === 'number' || typeof shipping === 'number') {
    total = orderTotal + shipping
  }
  return total
}

export const totalAfterTax = (orderTotal, shipping, tax) => {
  let total
  if (typeof orderTotal === 'number' || typeof shipping === 'number' || typeof tax === 'number') {
    total = totalBeforeTax(orderTotal, shipping)
  }
  return total + tax
}

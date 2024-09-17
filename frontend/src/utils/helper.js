export const totalHandler = (products) => {
  let total
  if (products) {
    total = products.reduce((sum, p) => {
      return sum + (p.quantity * p.newPrice)
    }, 0)
  }
  return total
}

const setup = (res, loc, navigate) => {
  if (loc.state.from) {
    navigate(loc.state.from)
    return
  }

  const { role } = res?.data?.user
  if (role === 'admin') {
    return navigate('/admin/system', { replace: true })
  } else if (role === 'client') {
    return navigate('/auth/user', { state: { from: res?.data.user.email }, replace: true })
  } else {
    return navigate('/', { state: { from: res.data?.user.email }, replace: true })
  }
}

export const handler = (res, loc, navigate, onSubmitProps, login) => {
  if (res && res.data.status === 'login successful') {
    onSubmitProps.resetForm()
    login(res?.data?.user)
    setup(res, loc, navigate)
  } else if (res && res.data.status === 'otp sent to user') {
    navigate(`/otp/2fa/${res.data.userId}`, { state: { from: res.data.hash } })
  }
}

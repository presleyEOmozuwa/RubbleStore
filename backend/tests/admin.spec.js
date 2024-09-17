const bcrypt = require('bcryptjs')
const User = require('../controllers/Models/user-model')
const { validationSchema } = require('../controllers/Utils/register-validation-utils')
const { registerAdmin } = require('../controllers/Admin/admin-register.service')
const { expect, it, afterEach, describe } = require('@jest/globals')

jest.mock('bcryptjs')
jest.mock('../controllers/Models/user-model')
jest.mock('../controllers/Utils/register-validation-utils')

describe('registerAdmin', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error when payload is missing', async () => {
    await expect(registerAdmin()).rejects.toThrow('data not found')
  })

  it('should throw error when validation fails', async () => {
    validationSchema.validate.mockReturnValue({
      error: { message: 'Invalid data' }
    })

    const payload = { email: 'test@example.com' }
    await expect(registerAdmin(payload)).rejects.toThrow('Invalid data')
  })

  it('should not proceed if email is not admin email', async () => {
    validationSchema.validate.mockReturnValue({
      error: null,
      value: { email: 'user@example.com' }
    })

    const result = await registerAdmin({ email: 'user@example.com' })
    expect(result).toEqual({})
    expect(User.findOne).not.toHaveBeenCalled()
  })

  it('should throw error if admin email already exists', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'
    validationSchema.validate.mockReturnValue({
      error: null,
      value: { email: 'admin@example.com' }
    })

    User.findOne.mockResolvedValue(true)

    await expect(registerAdmin({ email: 'admin@example.com' }))
      .rejects
      .toThrow('admin email already exist')
  })

  it('should throw error if password hashing fails', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'
    validationSchema.validate.mockReturnValue({
      error: null,
      value: { email: 'admin@example.com', password: 'password123' }
    })

    User.findOne.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue(null)

    await expect(registerAdmin({ email: 'admin@example.com', password: 'password123' }))
      .rejects
      .toThrow('admin password hash unsuccessful')
  })

  it('should create admin user and return the user object', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'
    const hashedPassword = 'hashedPassword123'
    const payload = {
      email: 'admin@example.com',
      username: 'adminuser',
      password: 'password123',
      terms: true
    }

    validationSchema.validate.mockReturnValue({
      error: null,
      value: payload
    })

    User.findOne.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue(hashedPassword)
    User.create.mockResolvedValue({
      _id: 'uniqueAdminId',
      email: payload.email,
      username: payload.username,
      password: hashedPassword,
      role: 'admin',
      terms: payload.terms
    })

    const result = await registerAdmin(payload)

    expect(User.findOne).toHaveBeenCalledWith({ email: process.env.ADMIN_EMAIL })
    expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10)
    expect(User.create).toHaveBeenCalledWith({
      stripecustomerid: 'not applicable',
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
      role: 'admin',
      terms: payload.terms
    })
    expect(result.adminUser).toEqual({
      _id: 'uniqueAdminId',
      email: payload.email,
      username: payload.username,
      password: hashedPassword,
      role: 'admin',
      terms: payload.terms
    })
  })
})

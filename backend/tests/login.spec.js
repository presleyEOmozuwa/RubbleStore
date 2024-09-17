const bcrypt = require('bcryptjs')
const User = require('../controllers/Models/user-model')
const DeletedUser = require('../controllers/Models/deleted-user-model')
const BlockedUser = require('../controllers/Models/blocked-user-model')
const { loginUser, googleloginUser } = require('../controllers/Login/login-service')
const { expect, it, describe } = require('@jest/globals')

// Mocking the models
jest.mock('../controllers/Models/user-model')
jest.mock('../controllers/Models/deleted-user-model')
jest.mock('../controllers/Models/blocked-user-model')

describe('Auth Functions', () => {
  describe('loginUser', () => {
    it('should throw an error if email or password is missing', async () => {
      await expect(loginUser(null, 'password')).rejects.toThrow('email and password fields are required')
      await expect(loginUser('email@example.com', null)).rejects.toThrow('email and password fields are required')
    })

    it('should throw an error if email is associated with a deleted account', async () => {
      DeletedUser.findOne.mockResolvedValue({ email: 'email@example.com' })
      await expect(loginUser('email@example.com', 'password')).rejects.toThrow('email is associated to a closed account')
    })

    it('should throw an error if email is associated with a blocked account', async () => {
      DeletedUser.findOne.mockResolvedValue(null)
      BlockedUser.findOne.mockResolvedValue({ email: 'email@example.com' })
      await expect(loginUser('email@example.com', 'password')).rejects.toThrow('email is associated to a blocked account')
    })

    it('should throw an error if email is invalid', async () => {
      DeletedUser.findOne.mockResolvedValue(null)
      BlockedUser.findOne.mockResolvedValue(null)
      User.findOne.mockResolvedValue(null)
      await expect(loginUser('email@example.com', 'password')).rejects.toThrow('invalid email or password')
    })

    it('should throw an error if password is incorrect', async () => {
      DeletedUser.findOne.mockResolvedValue(null)
      BlockedUser.findOne.mockResolvedValue(null)
      User.findOne.mockResolvedValue({ email: 'email@example.com', password: 'hashedpassword' })
      bcrypt.compare = jest.fn().mockResolvedValue(false)
      await expect(loginUser('email@example.com', 'password')).rejects.toThrow('invalid email or password')
    })

    it('should return the user if email and password are correct', async () => {
      DeletedUser.findOne.mockResolvedValue(null)
      BlockedUser.findOne.mockResolvedValue(null)
      const user = { email: 'email@example.com', password: 'hashedpassword' }
      User.findOne.mockResolvedValue(user)
      bcrypt.compare = jest.fn().mockResolvedValue(true)
      const result = await loginUser('email@example.com', 'password')
      expect(result).toBe(user)
    })
  })

  describe('googleloginUser', () => {
    it('should throw an error if payload is missing or invalid', async () => {
      await expect(googleloginUser(null)).rejects.toThrow('authentication failed, contact google')
      await expect(googleloginUser({})).rejects.toThrow('authentication failed, contact google')
    })

    it('should throw an error if email is associated with a deleted account', async () => {
      DeletedUser.findOne.mockResolvedValue({ email: 'email@example.com' })
      await expect(googleloginUser({ email: 'email@example.com' })).rejects.toThrow('email is associated to a closed account')
    })

    it('should throw an error if email is associated with a blocked account', async () => {
      DeletedUser.findOne.mockResolvedValue(null)
      BlockedUser.findOne.mockResolvedValue({ email: 'email@example.com' })
      await expect(googleloginUser({ email: 'email@example.com' })).rejects.toThrow('email is associated to a blocked account')
    })

    it('should return the user if Google login is successful', async () => {
      DeletedUser.findOne.mockResolvedValue(null)
      BlockedUser.findOne.mockResolvedValue(null)
      const user = { email: 'email@example.com' }
      User.findOne.mockResolvedValue(user)
      const result = await googleloginUser({ email: 'email@example.com' })
      expect(result).toBe(user)
    })
  })
})

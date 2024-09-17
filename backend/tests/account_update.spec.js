const bcrypt = require('bcryptjs')
const OldUserEmail = require('../controllers/Models/oldemail-model')
const { saveOldEmail, passwordChecker, passwordHasher } = require('../controllers/AccountUpdate/account-update-service')
const { expect, it, describe } = require('@jest/globals')

jest.mock('bcryptjs')
jest.mock('../controllers/Models/oldemail-model')

describe('authUtils', () => {
  describe('saveOldEmail', () => {
    it('should throw an error if the email already exists', async () => {
      OldUserEmail.findOne.mockResolvedValue({ email: 'test@example.com' })

      await expect(saveOldEmail({ email: 'new@example.com' }, 'test@example.com'))
        .rejects
        .toThrow('you cannot use an old email, provide a new one')
    })

    it('should save the new email if it does not exist', async () => {
      OldUserEmail.findOne.mockResolvedValue(null)
      OldUserEmail.create.mockResolvedValue({ email: 'new@example.com' })

      await saveOldEmail({ email: 'new@example.com' }, 'test@example.com')

      expect(OldUserEmail.create).toHaveBeenCalledWith({ email: 'new@example.com' })
    })
  })

  describe('passwordChecker', () => {
    it('should return true if the old password matches the user\'s password', async () => {
      bcrypt.compare.mockResolvedValue(true)

      const result = await passwordChecker({ password: 'hashedPassword' }, 'plainTextPassword')

      expect(result).toBe(true)
      expect(bcrypt.compare).toHaveBeenCalledWith('plainTextPassword', 'hashedPassword')
    })

    it('should return false if the old password does not match the user\'s password', async () => {
      bcrypt.compare.mockResolvedValue(false)

      const result = await passwordChecker({ password: 'hashedPassword' }, 'wrongPassword')

      expect(result).toBe(false)
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword')
    })
  })

  describe('passwordHasher', () => {
    it('should return a hashed password different from the plain password', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword')

      const result = await passwordHasher('plainTextPassword')

      expect(result).toBe('hashedPassword')
      expect(result).not.toBe('plainTextPassword')
      expect(bcrypt.hash).toHaveBeenCalledWith('plainTextPassword', 10)
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { JwtBlacklistService } from './jwt-blacklist.service'

describe('JwtBlacklistService', () => {
  let service: JwtBlacklistService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtBlacklistService],
    }).compile()

    service = module.get<JwtBlacklistService>(JwtBlacklistService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('addToBlacklist', () => {
    it('should add a token to the blacklist', async () => {
      const token = 'test-token'
      const ttl = 3600

      await expect(service.addToBlacklist(token, ttl)).resolves.not.toThrow()
    })

    it('should add token with TTL', async () => {
      const token = 'test-token-2'
      const ttl = 7200

      await service.addToBlacklist(token, ttl)
      const isBlacklisted = await service.isBlacklisted(token)

      expect(isBlacklisted).toBe(true)
    })
  })

  describe('isBlacklisted', () => {
    it('should return false for non-blacklisted token', async () => {
      const token = 'non-blacklisted-token'

      const result = await service.isBlacklisted(token)

      expect(result).toBe(false)
    })

    it('should return true for blacklisted token', async () => {
      const token = 'blacklisted-token'

      await service.addToBlacklist(token, 3600)
      const result = await service.isBlacklisted(token)

      expect(result).toBe(true)
    })

    it('should return false for expired token', async () => {
      const token = 'expired-token'

      // Add token with 1 second TTL
      await service.addToBlacklist(token, 1)

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 1100))

      const result = await service.isBlacklisted(token)

      expect(result).toBe(false)
    })
  })

  describe('removeFromBlacklist', () => {
    it('should remove token from blacklist', async () => {
      const token = 'remove-token'

      await service.addToBlacklist(token, 3600)
      expect(await service.isBlacklisted(token)).toBe(true)

      await service.removeFromBlacklist(token)
      expect(await service.isBlacklisted(token)).toBe(false)
    })

    it('should not throw error when removing non-existent token', async () => {
      const token = 'non-existent-token'

      await expect(service.removeFromBlacklist(token)).resolves.not.toThrow()
    })
  })

  describe('clearBlacklist', () => {
    it('should clear all tokens from blacklist', async () => {
      // Add multiple tokens
      await service.addToBlacklist('token-1', 3600)
      await service.addToBlacklist('token-2', 3600)
      await service.addToBlacklist('token-3', 3600)

      // Verify they are blacklisted
      expect(await service.isBlacklisted('token-1')).toBe(true)
      expect(await service.isBlacklisted('token-2')).toBe(true)
      expect(await service.isBlacklisted('token-3')).toBe(true)

      // Clear blacklist
      await service.clearBlacklist()

      // Verify all tokens are removed
      expect(await service.isBlacklisted('token-1')).toBe(false)
      expect(await service.isBlacklisted('token-2')).toBe(false)
      expect(await service.isBlacklisted('token-3')).toBe(false)
    })
  })
})

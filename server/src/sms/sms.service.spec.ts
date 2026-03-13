import { Test, TestingModule } from '@nestjs/testing'
import { SmsService } from './sms.service'

describe('SmsService', () => {
  let service: SmsService
  let redisMock: any

  beforeEach(async () => {
    // Mock Redis
    redisMock = {
      setex: jest.fn().mockResolvedValue('OK'),
      get: jest.fn(),
      del: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: 'defaultIORedis',
          useValue: redisMock,
        },
      ],
    }).compile()

    service = module.get<SmsService>(SmsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateCode', () => {
    it('should generate a 6-digit code', () => {
      const code = service.generateCode()

      expect(code).toBeDefined()
      expect(code).toHaveLength(6)
      expect(/^\d{6}$/.test(code)).toBe(true)
    })

    it('should generate different codes each time', () => {
      const code1 = service.generateCode()
      const code2 = service.generateCode()

      // 不一定完全不同，但多次调用应该有不同的概率
      expect(code1).not.toEqual(code2)
    })
  })

  describe('sendVerificationCode', () => {
    it('should send verification code and store in Redis', async () => {
      const phone = '13800138000'
      const result = await service.sendVerificationCode(phone)

      expect(result.success).toBe(true)
      expect(result.code).toBeDefined()
      expect(result.code).toHaveLength(6)
      expect(redisMock.setex).toHaveBeenCalledWith(
        `sms:code:${phone}`,
        300,
        result.code,
      )
    })

    it('should store code with 5 minutes TTL', async () => {
      const phone = '13800138000'
      await service.sendVerificationCode(phone)

      expect(redisMock.setex).toHaveBeenCalledWith(
        `sms:code:${phone}`,
        300,
        expect.any(String),
      )
    })
  })

  describe('verifyCode', () => {
    it('should verify valid code', async () => {
      const phone = '13800138000'
      const code = '123456'

      redisMock.get.mockResolvedValueOnce(code)
      redisMock.del.mockResolvedValueOnce(1)

      const result = await service.verifyCode(phone, code)

      expect(result).toBe(true)
      expect(redisMock.del).toHaveBeenCalledWith(`sms:code:${phone}`)
    })

    it('should return false for invalid code', async () => {
      const phone = '13800138000'
      const storedCode = '123456'
      const invalidCode = '654321'

      redisMock.get.mockResolvedValueOnce(storedCode)

      const result = await service.verifyCode(phone, invalidCode)

      expect(result).toBe(false)
      expect(redisMock.del).not.toHaveBeenCalled()
    })

    it('should return false when code not found', async () => {
      const phone = '13800138000'
      const code = '123456'

      redisMock.get.mockResolvedValueOnce(null)

      const result = await service.verifyCode(phone, code)

      expect(result).toBe(false)
      expect(redisMock.del).not.toHaveBeenCalled()
    })

    it('should delete code after successful verification', async () => {
      const phone = '13800138000'
      const code = '123456'

      redisMock.get.mockResolvedValueOnce(code)
      redisMock.del.mockResolvedValueOnce(1)

      await service.verifyCode(phone, code)

      expect(redisMock.del).toHaveBeenCalledWith(`sms:code:${phone}`)
    })
  })

  describe('canSendCode', () => {
    it('should allow sending code if not sent recently', async () => {
      const phone = '13800138000'

      redisMock.get.mockResolvedValueOnce(null)
      redisMock.setex.mockResolvedValueOnce('OK')

      const result = await service.canSendCode(phone)

      expect(result).toBe(true)
      expect(redisMock.setex).toHaveBeenCalledWith(
        `sms:limit:${phone}`,
        60,
        '1',
      )
    })

    it('should prevent sending code if sent recently', async () => {
      const phone = '13800138000'

      redisMock.get.mockResolvedValueOnce('1')

      const result = await service.canSendCode(phone)

      expect(result).toBe(false)
      expect(redisMock.setex).not.toHaveBeenCalled()
    })

    it('should set 1 minute limit', async () => {
      const phone = '13800138000'

      redisMock.get.mockResolvedValueOnce(null)
      redisMock.setex.mockResolvedValueOnce('OK')

      await service.canSendCode(phone)

      expect(redisMock.setex).toHaveBeenCalledWith(
        `sms:limit:${phone}`,
        60,
        '1',
      )
    })
  })
})

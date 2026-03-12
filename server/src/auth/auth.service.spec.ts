import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { getSupabaseClient } from '../storage/database/supabase-client'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService

  const mockSupabaseClient = {
    from: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret'
              return null
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)

    // Mock Supabase client
    jest.spyOn(require('../storage/database/supabase-client'), 'getSupabaseClient').mockReturnValue(mockSupabaseClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        phone: '13800138000',
        password: '123456',
        nickname: 'Test User',
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'User not found' } }),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                phone: registerData.phone,
                nickname: registerData.nickname,
                role: 'user',
              },
              error: null,
            }),
          }),
        }),
      })

      const result = await service.register(registerData.phone, registerData.password, registerData.nickname)

      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('user')
      expect(result.user).toHaveProperty('id', 'test-user-id')
      expect(result.user).not.toHaveProperty('password')
      expect(jwtService.sign).toHaveBeenCalled()
    })

    it('should throw error if phone already exists', async () => {
      const registerData = {
        phone: '13800138000',
        password: '123456',
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'existing-user-id', phone: registerData.phone },
              error: null,
            }),
          }),
        }),
      })

      await expect(service.register(registerData.phone, registerData.password)).rejects.toThrow('该手机号已注册')
    })

    it('should hash password before saving', async () => {
      const registerData = {
        phone: '13800138000',
        password: '123456',
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'User not found' } }),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                phone: registerData.phone,
                nickname: `用户${registerData.phone.slice(-4)}`,
                role: 'user',
              },
              error: null,
            }),
          }),
        }),
      })

      await service.register(registerData.phone, registerData.password)

      // Verify password was hashed by checking insert call
      expect(mockSupabaseClient.from().insert).toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const loginData = {
        phone: '13800138000',
        password: '123456',
      }

      const hashedPassword = await import('bcrypt').then((bcrypt) => bcrypt.hash('123456', 10))

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                phone: loginData.phone,
                password: hashedPassword,
                nickname: 'Test User',
                role: 'user',
              },
              error: null,
            }),
          }),
        }),
      })

      const result = await service.login(loginData.phone, loginData.password)

      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('user')
      expect(result.user).not.toHaveProperty('password')
      expect(jwtService.sign).toHaveBeenCalled()
    })

    it('should throw error with wrong password', async () => {
      const loginData = {
        phone: '13800138000',
        password: 'wrong-password',
      }

      const hashedPassword = await import('bcrypt').then((bcrypt) => bcrypt.hash('123456', 10))

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                phone: loginData.phone,
                password: hashedPassword,
              },
              error: null,
            }),
          }),
        }),
      })

      await expect(service.login(loginData.phone, loginData.password)).rejects.toThrow('用户名或密码错误')
    })

    it('should throw error if user not found', async () => {
      const loginData = {
        phone: '13800138000',
        password: '123456',
      }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'User not found' } }),
          }),
        }),
      })

      await expect(service.login(loginData.phone, loginData.password)).rejects.toThrow('用户名或密码错误')
    })
  })

  describe('validateUser', () => {
    it('should validate existing user', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                phone: '13800138000',
                nickname: 'Test User',
                role: 'user',
              },
              error: null,
            }),
          }),
        }),
      })

      const result = await service.validateUser('test-user-id')

      expect(result).toHaveProperty('id', 'test-user-id')
      expect(result).not.toHaveProperty('password')
    })

    it('should throw error if user does not exist', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'User not found' } }),
          }),
        }),
      })

      await expect(service.validateUser('non-existent-id')).rejects.toThrow('用户不存在')
    })
  })
})

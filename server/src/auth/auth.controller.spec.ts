import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    loginWithCode: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        phone: '13800138000',
        password: '123456',
        nickname: 'Test User',
      }

      const expectedResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: 'user-id',
          phone: registerData.phone,
          nickname: registerData.nickname,
          role: 'user',
        },
      }

      mockAuthService.register.mockResolvedValueOnce(expectedResponse)

      const result = await controller.register(registerData)

      expect(result.code).toBe(200)
      expect(result.msg).toBe('注册成功')
      expect(result.data).toEqual(expectedResponse)
      expect(authService.register).toHaveBeenCalledWith(
        registerData.phone,
        registerData.password,
        registerData.nickname,
      )
    })

    it('should return error if phone or password is missing', async () => {
      const result = await controller.register({ phone: '', password: '' })

      expect(result.code).toBe(400)
      expect(result.msg).toBe('手机号和密码不能为空')
      expect(authService.register).not.toHaveBeenCalled()
    })

    it('should return error if password is too short', async () => {
      const result = await controller.register({
        phone: '13800138000',
        password: '123',
      })

      expect(result.code).toBe(400)
      expect(result.msg).toBe('密码长度不能少于6位')
      expect(authService.register).not.toHaveBeenCalled()
    })

    it('should handle registration errors', async () => {
      const error = new Error('该手机号已注册') as any
      error.status = 409

      mockAuthService.register.mockRejectedValueOnce(error)

      const result = await controller.register({
        phone: '13800138000',
        password: '123456',
      })

      expect(result.code).toBe(409)
      expect(result.msg).toBe('该手机号已注册')
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        phone: '13800138000',
        password: '123456',
      }

      const expectedResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: 'user-id',
          phone: loginData.phone,
          nickname: 'Test User',
          role: 'user',
        },
      }

      mockAuthService.login.mockResolvedValueOnce(expectedResponse)

      const result = await controller.login(loginData)

      expect(result.code).toBe(200)
      expect(result.msg).toBe('登录成功')
      expect(result.data).toEqual(expectedResponse)
      expect(authService.login).toHaveBeenCalledWith(
        loginData.phone,
        loginData.password,
      )
    })

    it('should return error if phone or password is missing', async () => {
      const result = await controller.login({ phone: '', password: '' })

      expect(result.code).toBe(400)
      expect(result.msg).toBe('手机号和密码不能为空')
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('should handle login errors', async () => {
      const error = new Error('用户名或密码错误') as any
      error.status = 401

      mockAuthService.login.mockRejectedValueOnce(error)

      const result = await controller.login({
        phone: '13800138000',
        password: 'wrong-password',
      })

      expect(result.code).toBe(401)
      expect(result.msg).toBe('用户名或密码错误')
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockUser = {
        userId: 'user-id',
        phone: '13800138000',
        nickname: 'Test User',
        role: 'user',
      }

      const expectedResponse = {
        access_token: 'new-jwt-token',
        user: mockUser,
      }

      mockAuthService.refreshToken.mockResolvedValueOnce(expectedResponse)

      const result = await controller.refreshToken(mockUser)

      expect(result.code).toBe(200)
      expect(result.msg).toBe('刷新成功')
      expect(result.data).toEqual(expectedResponse)
      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser.userId)
    })

    it('should handle refresh errors', async () => {
      const mockUser = { userId: 'user-id' }
      const error = new Error('用户不存在') as any
      error.status = 404

      mockAuthService.refreshToken.mockRejectedValueOnce(error)

      const result = await controller.refreshToken(mockUser)

      expect(result.code).toBe(404)
      expect(result.msg).toBe('用户不存在')
    })
  })

  describe('loginWithCode', () => {
    it('should login with verification code successfully', async () => {
      const loginData = {
        phone: '13800138000',
        code: '123456',
      }

      const expectedResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: 'user-id',
          phone: loginData.phone,
          nickname: 'Test User',
          role: 'user',
        },
      }

      mockAuthService.loginWithCode.mockResolvedValueOnce(expectedResponse)

      const result = await controller.loginWithCode(loginData)

      expect(result.code).toBe(200)
      expect(result.msg).toBe('登录成功')
      expect(result.data).toEqual(expectedResponse)
      expect(authService.loginWithCode).toHaveBeenCalledWith(
        loginData.phone,
        loginData.code,
      )
    })

    it('should return error if phone or code is missing', async () => {
      const result = await controller.loginWithCode({ phone: '', code: '' })

      expect(result.code).toBe(400)
      expect(result.msg).toBe('手机号和验证码不能为空')
      expect(authService.loginWithCode).not.toHaveBeenCalled()
    })

    it('should handle login with code errors', async () => {
      const error = new Error('验证码错误或已过期') as any
      error.status = 401

      mockAuthService.loginWithCode.mockRejectedValueOnce(error)

      const result = await controller.loginWithCode({
        phone: '13800138000',
        code: 'wrong-code',
      })

      expect(result.code).toBe(401)
      expect(result.msg).toBe('验证码错误或已过期')
    })
  })
})

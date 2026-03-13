import { Controller, Post, Body, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { GetCurrentUser } from '../decorators/get-current-user.decorator'
import { Public } from '../decorators/public.decorator'

interface RegisterDto {
  phone: string
  password: string
  nickname?: string
}

interface LoginDto {
  phone: string
  password: string
}

interface LoginWithCodeDto {
  phone: string
  code: string
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 200, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 409, description: '手机号已注册' })
  async register(@Body() body: RegisterDto) {
    try {
      const { phone, password, nickname } = body

      // 参数验证
      if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
        throw new HttpException(
          { code: 400, msg: '手机号不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
        throw new HttpException(
          { code: 400, msg: '手机号格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        throw new HttpException(
          { code: 400, msg: '密码长度不能少于6位', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      if (password.length > 20) {
        throw new HttpException(
          { code: 400, msg: '密码长度不能超过20位', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证昵称（如果提供）
      if (nickname && (typeof nickname !== 'string' || nickname.length > 20)) {
        throw new HttpException(
          { code: 400, msg: '昵称长度不能超过20位', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const result = await this.authService.register(phone.trim(), password, nickname ? nickname.trim() : undefined)
      return {
        code: 200,
        msg: '注册成功',
        data: result,
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: error.status || 500,
          message: isProduction ? '注册失败，请稍后重试' : (error.message || '注册失败'),
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * 用户登录
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() body: LoginDto) {
    try {
      const { phone, password } = body

      // 参数验证
      if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
        throw new HttpException(
          { code: 400, msg: '手机号不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
        throw new HttpException(
          { code: 400, msg: '手机号格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      if (!password || typeof password !== 'string' || password.length === 0) {
        throw new HttpException(
          { code: 400, msg: '密码不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const result = await this.authService.login(phone.trim(), password)
      return {
        code: 200,
        msg: '登录成功',
        data: result,
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: error.status || 500,
          message: isProduction ? '登录失败，请稍后重试' : (error.message || '登录失败'),
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * 获取当前用户信息
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getCurrentUser(@GetCurrentUser() user: any) {
    return {
      code: 200,
      msg: '获取成功',
      data: user,
    }
  }

  /**
   * 刷新 token
   */
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '刷新 token' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async refreshToken(@GetCurrentUser() user: any) {
    try {
      const result = await this.authService.refreshToken(user.userId)
      return {
        code: 200,
        msg: '刷新成功',
        data: result,
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: error.status || 500,
          message: isProduction ? '刷新失败，请稍后重试' : (error.message || '刷新失败'),
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * 验证码登录
   */
  @Public()
  @Post('login-with-code')
  @ApiOperation({ summary: '验证码登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 401, description: '验证码错误或已过期' })
  async loginWithCode(@Body() body: LoginWithCodeDto) {
    try {
      const { phone, code } = body

      // 参数验证
      if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
        throw new HttpException(
          { code: 400, msg: '手机号不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
        throw new HttpException(
          { code: 400, msg: '手机号格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      if (!code || typeof code !== 'string' || code.trim().length === 0) {
        throw new HttpException(
          { code: 400, msg: '验证码不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证验证码格式（6位数字）
      if (!/^\d{6}$/.test(code.trim())) {
        throw new HttpException(
          { code: 400, msg: '验证码格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const result = await this.authService.loginWithCode(phone.trim(), code.trim())
      return {
        code: 200,
        msg: '登录成功',
        data: result,
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: error.status || 500,
          message: isProduction ? '登录失败，请稍后重试' : (error.message || '登录失败'),
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * 用户登出
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async logout(@GetCurrentUser() user: any, req: any) {
    try {
      const token = req.headers?.authorization?.replace('Bearer ', '')

      if (token) {
        // 计算剩余有效期
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)

        // 将 token 加入黑名单
        await this.authService.addToBlacklist(token, expiresIn)
      }

      return {
        code: 200,
        msg: '登出成功',
        data: null,
      }
    } catch (error: any) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: error.status || 500,
          message: isProduction ? '登出失败，请稍后重试' : (error.message || '登出失败'),
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

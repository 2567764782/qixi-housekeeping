import { Controller, Get, Query, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import { FieldPermission } from '../decorators/field-permission.decorator'
import { FieldPermissionInterceptor } from '../interceptors/field-permission.interceptor'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取所有用户列表
   */
  @Get()
  async getAllUsers(@Query('limit') limit?: string) {
    try {
      const userCount = limit ? parseInt(limit, 10) : 100
      if (Number.isNaN(userCount) || userCount < 1 || userCount > 500) {
        throw new HttpException(
          { code: 400, message: 'limit 参数必须在 1-500 之间', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const users = await this.usersService.getAllUsers(userCount)

      return {
        code: 200,
        message: '获取成功',
        data: users,
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取用户列表失败，请稍后重试' : (error.message || '获取用户列表失败'),
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * 获取随机用户列表（用于轮播图展示）
   */
  @Get('random')
  @FieldPermission('users', ['id', 'nickname', 'avatar', 'gender', 'city'])
  @UseInterceptors(FieldPermissionInterceptor)
  async getRandomUsers(@Query('limit') limit?: string) {
    try {
      // 验证 limit 参数
      const userCount = limit ? parseInt(limit, 10) : 10
      if (Number.isNaN(userCount) || userCount < 1 || userCount > 100) {
        throw new HttpException(
          { code: 400, message: 'limit 参数必须在 1-100 之间', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const users = await this.usersService.getRandomUsers(userCount)

      return {
        code: 200,
        message: '获取成功',
        data: users,
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取用户列表失败，请稍后重试' : (error.message || '获取用户列表失败'),
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * 根据城市获取用户列表
   */
  @Get('by-city')
  async getUsersByCity(@Query('city') city: string, @Query('limit') limit?: string) {
    try {
      if (!city || city.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '城市参数不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证 limit 参数
      const userCount = limit ? parseInt(limit, 10) : 10
      if (Number.isNaN(userCount) || userCount < 1 || userCount > 100) {
        throw new HttpException(
          { code: 400, message: 'limit 参数必须在 1-100 之间', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证 city 参数（防止SQL注入和非法字符）
      if (!/^[a-zA-Z\u4e00-\u9fa5\s]+$/.test(city.trim())) {
        throw new HttpException(
          { code: 400, message: '城市参数包含非法字符', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const users = await this.usersService.getUsersByCity(city.trim(), userCount)

      return {
        code: 200,
        message: '获取成功',
        data: users,
      }
    } catch (error) {
      // 区分业务错误和系统错误
      if (error instanceof HttpException) {
        throw error
      }
      // 生产环境隐藏详细错误信息
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取城市用户列表失败，请稍后重试' : (error.message || '获取城市用户列表失败'),
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  /**
   * 获取用户统计信息
   */
  @Get('stats')
  async getUserStats() {
    try {
      const stats = await this.usersService.getUserStats()

      return {
        code: 200,
        message: '获取成功',
        data: stats,
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取用户统计失败，请稍后重试' : (error.message || '获取用户统计失败'),
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

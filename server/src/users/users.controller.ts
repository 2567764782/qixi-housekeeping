import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取随机用户列表（用于轮播图展示）
   */
  @Get('random')
  async getRandomUsers(@Query('limit') limit?: string) {
    try {
      const userCount = limit ? parseInt(limit, 10) : 10
      const users = await this.usersService.getRandomUsers(userCount)

      return {
        code: 200,
        message: '获取成功',
        data: users,
      }
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          message: error.message || '获取用户列表失败',
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
      if (!city) {
        throw new Error('城市参数不能为空')
      }

      const userCount = limit ? parseInt(limit, 10) : 10
      const users = await this.usersService.getUsersByCity(city, userCount)

      return {
        code: 200,
        message: '获取成功',
        data: users,
      }
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          message: error.message || '获取城市用户列表失败',
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
      throw new HttpException(
        {
          code: 500,
          message: error.message || '获取用户统计失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

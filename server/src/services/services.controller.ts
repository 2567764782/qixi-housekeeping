import { Controller, Get, Post, Query, HttpException, HttpStatus } from '@nestjs/common'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(@Query() query: any) {
    try {
      // 解析分页参数
      let page = 1
      let limit = 10

      if (query.page !== undefined) {
        page = parseInt(query.page, 10)
        if (Number.isNaN(page) || page < 1) {
          throw new HttpException(
            { code: 400, message: '页码必须为正整数', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
        if (page > 1000) {
          throw new HttpException(
            { code: 400, message: '页码不能超过1000', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      if (query.limit !== undefined) {
        limit = parseInt(query.limit, 10)
        if (Number.isNaN(limit) || limit < 1) {
          throw new HttpException(
            { code: 400, message: '每页数量必须为正整数', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
        if (limit > 100) {
          throw new HttpException(
            { code: 400, message: '每页数量不能超过100', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      const result = await this.servicesService.findAll(page, limit)

      return {
        code: 200,
        msg: 'success',
        data: result
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取服务列表失败，请稍后重试' : (error.message || '获取服务列表失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('seed')
  async seedData() {
    try {
      const result = await this.servicesService.seedData()
      return {
        code: 200,
        msg: 'success',
        data: result
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '初始化服务数据失败，请稍后重试' : (error.message || '初始化服务数据失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('update-prices')
  async updatePrices() {
    try {
      const result = await this.servicesService.updatePrices()
      return {
        code: 200,
        msg: 'success',
        data: result
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '更新服务价格失败，请稍后重试' : (error.message || '更新服务价格失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

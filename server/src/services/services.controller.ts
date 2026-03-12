import { Controller, Get, Post } from '@nestjs/common'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll() {
    return await this.servicesService.findAll()
  }

  @Get('seed')
  async seedData() {
    return await this.servicesService.seedData()
  }

  @Post('update-prices')
  async updatePrices() {
    return await this.servicesService.updatePrices()
  }
}

import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll() {
    return await this.ordersService.findAll()
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.ordersService.findByUser(userId)
  }

  @Post()
  async create(@Body() createOrderDto: any) {
    return await this.ordersService.create(createOrderDto)
  }
}

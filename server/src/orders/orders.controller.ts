import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll() {
    return {
      code: 200,
      msg: 'success',
      data: await this.ordersService.findAll()
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return {
      code: 200,
      msg: 'success',
      data: await this.ordersService.findByUser(userId)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id)
    if (!order) {
      return {
        code: 404,
        msg: 'Order not found',
        data: null
      }
    }
    return {
      code: 200,
      msg: 'success',
      data: order
    }
  }

  @Post()
  async create(@Body() createOrderDto: any) {
    try {
      const order = await this.ordersService.create(createOrderDto)
      return {
        code: 200,
        msg: 'success',
        data: order
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: any) {
    try {
      const order = await this.ordersService.update(id, updateOrderDto)
      return {
        code: 200,
        msg: 'success',
        data: order
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  // 自动接单接口
  @Post(':id/auto-accept')
  async autoAccept(@Param('id') id: string) {
    try {
      const order = await this.ordersService.autoAccept(id)
      return {
        code: 200,
        msg: 'Auto accept success',
        data: order
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  // 自动派单接口
  @Post(':id/auto-assign')
  async autoAssign(@Param('id') id: string) {
    try {
      const order = await this.ordersService.autoAssign(id)
      return {
        code: 200,
        msg: 'Auto assign success',
        data: order
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  // 自动配置接口（同时自动接单和自动派单）
  @Post(':id/auto-configure')
  async autoConfigure(@Param('id') id: string) {
    try {
      const order = await this.ordersService.autoConfigure(id)
      return {
        code: 200,
        msg: 'Auto configure success',
        data: order
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  // 批量自动配置接口
  @Post('batch/auto-configure')
  async autoConfigureAll() {
    try {
      const result = await this.ordersService.autoConfigureAll()
      return {
        code: 200,
        msg: 'Batch auto configure success',
        data: result
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  // 生成虚拟订单接口
  @Post('generate-mock')
  async generateMockOrders(@Body() body: { count?: number }) {
    try {
      const count = body.count || 10
      const result = await this.ordersService.generateMockOrders(count)
      return {
        code: 200,
        msg: `Successfully generated ${result.success} mock orders`,
        data: result
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }
}

import { Controller, Get, Post, Body, Param, Patch, HttpException, HttpStatus } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { Public } from '../decorators/public.decorator'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Get('user/current/stats')
  async getUserOrderStats() {
    try {
      // 获取当前用户的订单统计（模拟数据）
      return {
        code: 200,
        msg: 'success',
        data: {
          total: 0,
          pending: 0,
          completed: 0
        }
      }
    } catch (error) {
      return {
        code: 200,
        msg: 'success',
        data: {
          total: 0,
          pending: 0,
          completed: 0
        }
      }
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.ordersService.findAll()
      return {
        code: 200,
        msg: 'success',
        data
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取订单列表失败，请稍后重试' : (error.message || '获取订单列表失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    try {
      // 验证 userId
      if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '用户ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const data = await this.ordersService.findByUser(userId.trim())
      return {
        code: 200,
        msg: 'success',
        data
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取用户订单失败，请稍后重试' : (error.message || '获取用户订单失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      // 验证 ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const order = await this.ordersService.findOne(id.trim())

      if (!order) {
        throw new HttpException(
          { code: 404, message: '订单不存在', data: null },
          HttpStatus.NOT_FOUND
        )
      }

      return {
        code: 200,
        msg: 'success',
        data: order
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取订单详情失败，请稍后重试' : (error.message || '获取订单详情失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post()
  async create(@Body() createOrderDto: any) {
    try {
      // 参数验证
      if (!createOrderDto.userId || typeof createOrderDto.userId !== 'string') {
        throw new HttpException(
          { code: 400, message: '用户ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!createOrderDto.serviceId || typeof createOrderDto.serviceId !== 'string') {
        throw new HttpException(
          { code: 400, message: '服务ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!createOrderDto.serviceName || typeof createOrderDto.serviceName !== 'string') {
        throw new HttpException(
          { code: 400, message: '服务名称不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!createOrderDto.address || typeof createOrderDto.address !== 'string' || createOrderDto.address.trim().length < 5) {
        throw new HttpException(
          { code: 400, message: '服务地址不能少于5个字符', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!createOrderDto.phone || typeof createOrderDto.phone !== 'string') {
        throw new HttpException(
          { code: 400, message: '联系电话不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(createOrderDto.phone)) {
        throw new HttpException(
          { code: 400, message: '手机号格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!createOrderDto.appointmentDate || typeof createOrderDto.appointmentDate !== 'string') {
        throw new HttpException(
          { code: 400, message: '预约日期不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      // 验证日期格式
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(createOrderDto.appointmentDate)) {
        throw new HttpException(
          { code: 400, message: '预约日期格式不正确（应为 YYYY-MM-DD）', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      // 验证日期是否为未来日期
      const appointmentDate = new Date(createOrderDto.appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (appointmentDate < today) {
        throw new HttpException(
          { code: 400, message: '预约日期不能早于今天', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      // 验证日期不能超过1年
      const maxDate = new Date()
      maxDate.setFullYear(maxDate.getFullYear() + 1)
      if (appointmentDate > maxDate) {
        throw new HttpException(
          { code: 400, message: '预约日期不能超过1年', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!createOrderDto.appointmentTime || typeof createOrderDto.appointmentTime !== 'string') {
        throw new HttpException(
          { code: 400, message: '预约时间不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      // 验证时间格式
      const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)-([01]?\d|2[0-3]):([0-5]\d)$/
      if (!timeRegex.test(createOrderDto.appointmentTime)) {
        throw new HttpException(
          { code: 400, message: '预约时间格式不正确（应为 HH:MM-HH:MM）', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      // 备注可选，但如果提供了则验证长度
      if (createOrderDto.remark && typeof createOrderDto.remark === 'string') {
        if (createOrderDto.remark.length > 500) {
          throw new HttpException(
            { code: 400, message: '备注不能超过500个字符', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      // 清理输入数据（防止XSS）
      const cleanOrderDto = {
        userId: createOrderDto.userId.trim(),
        serviceId: createOrderDto.serviceId.trim(),
        serviceName: createOrderDto.serviceName.trim(),
        address: createOrderDto.address.trim(),
        phone: createOrderDto.phone.trim(),
        appointmentDate: createOrderDto.appointmentDate.trim(),
        appointmentTime: createOrderDto.appointmentTime.trim(),
        remark: createOrderDto.remark ? createOrderDto.remark.trim() : '',
      }

      const order = await this.ordersService.create(cleanOrderDto)
      return {
        code: 200,
        msg: '订单创建成功',
        data: order
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '订单创建失败，请稍后重试' : (error.message || '创建订单失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: any) {
    try {
      // 验证 ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证状态（如果提供）
      if (updateOrderDto.status !== undefined) {
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
        if (!validStatuses.includes(updateOrderDto.status)) {
          throw new HttpException(
            { code: 400, message: '无效的订单状态', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      const order = await this.ordersService.update(id, updateOrderDto)
      return {
        code: 200,
        msg: '订单更新成功',
        data: order
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '订单更新失败，请稍后重试' : (error.message || '更新订单失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // 自动接单接口
  @Post(':id/auto-accept')
  async autoAccept(@Param('id') id: string) {
    try {
      // 验证 ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const order = await this.ordersService.autoAccept(id.trim())
      return {
        code: 200,
        msg: '自动接单成功',
        data: order
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '自动接单失败，请稍后重试' : (error.message || '自动接单失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // 自动派单接口
  @Post(':id/auto-assign')
  async autoAssign(@Param('id') id: string) {
    try {
      // 验证 ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const order = await this.ordersService.autoAssign(id.trim())
      return {
        code: 200,
        msg: '自动派单成功',
        data: order
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '自动派单失败，请稍后重试' : (error.message || '自动派单失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // 自动配置接口（同时自动接单和自动派单）
  @Post(':id/auto-configure')
  async autoConfigure(@Param('id') id: string) {
    try {
      // 验证 ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const order = await this.ordersService.autoConfigure(id.trim())
      return {
        code: 200,
        msg: '自动配置成功',
        data: order
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '自动配置失败，请稍后重试' : (error.message || '自动配置失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // 批量自动配置接口
  @Post('batch/auto-configure')
  async autoConfigureAll() {
    try {
      const result = await this.ordersService.autoConfigureAll()
      return {
        code: 200,
        msg: '批量自动配置成功',
        data: result
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '批量自动配置失败，请稍后重试' : (error.message || '批量自动配置失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // 生成虚拟订单接口
  @Post('generate-mock')
  async generateMockOrders(@Body() body: { count?: number }) {
    try {
      // 验证 count 参数
      let count = 10
      if (body.count !== undefined) {
        count = parseInt(String(body.count), 10)
        if (Number.isNaN(count) || count < 1) {
          throw new HttpException(
            { code: 400, message: '订单数量必须为正整数', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
        if (count > 100) {
          throw new HttpException(
            { code: 400, message: '订单数量不能超过100', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      const result = await this.ordersService.generateMockOrders(count)
      return {
        code: 200,
        msg: `成功生成 ${result.success} 个虚拟订单`,
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
          message: isProduction ? '生成虚拟订单失败，请稍后重试' : (error.message || '生成虚拟订单失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

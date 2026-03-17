import { Controller, Post, Body, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from '../decorators/public.decorator';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: '订单ID不能为空' })
  orderId: string;

  @IsNumber()
  @Min(0.01, { message: '支付金额必须大于0' })
  amount: number;

  @IsOptional()
  @IsString()
  method?: string;
}

class MockPaymentDto {
  @IsString()
  @IsNotEmpty({ message: '支付ID不能为空' })
  paymentId: string;
}

class RefundDto {
  @IsString()
  @IsNotEmpty({ message: '订单ID不能为空' })
  orderId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * 创建支付订单
   * POST /api/payment/create
   */
  @Post('create')
  async createPayment(@Body() dto: CreatePaymentDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.paymentService.createPayment(
        dto.orderId,
        userId,
        dto.amount,
        dto.method || 'wechat'
      );
      return { code: 200, msg: '支付订单创建成功', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 模拟支付（开发测试用）
   * POST /api/payment/mock
   */
  @Post('mock')
  async mockPayment(@Body() dto: MockPaymentDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.paymentService.mockPayment(dto.paymentId, userId);
      return { code: 200, msg: '支付成功', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 查询支付状态
   * GET /api/payment/query
   */
  @Public()
  @Get('query')
  async queryPayment(@Query('paymentId') paymentId: string) {
    try {
      const data = await this.paymentService.queryPayment(paymentId);
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 根据订单ID查询支付状态
   * GET /api/payment/order/:orderId
   */
  @Public()
  @Get('order/:orderId')
  async queryPaymentByOrderId(@Param('orderId') orderId: string) {
    try {
      const data = await this.paymentService.queryPaymentByOrderId(orderId);
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 申请退款
   * POST /api/payment/refund
   */
  @Post('refund')
  async refund(@Body() dto: RefundDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.paymentService.refund(dto.orderId, userId, dto.reason);
      return { code: 200, msg: '退款申请已提交', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取用户支付记录
   * GET /api/payment/list
   */
  @Public()
  @Get('list')
  async getUserPayments(
    @Query('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20'
  ) {
    try {
      const uid = userId || 'mock-user-id';
      const data = await this.paymentService.getUserPayments(
        uid,
        parseInt(page, 10) || 1,
        parseInt(pageSize, 10) || 20
      );
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

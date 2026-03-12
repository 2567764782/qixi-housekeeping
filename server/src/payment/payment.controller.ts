import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WechatPayService } from './wechat-pay.service';
import { CreatePaymentDto, RefundDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly wechatPayService: WechatPayService) {}

  /**
   * 创建支付订单
   */
  @Post('create')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.wechatPayService.createPaymentOrder(
      createPaymentDto.orderId,
      createPaymentDto.description,
      createPaymentDto.amount,
      createPaymentDto.openid
    );

    return {
      status: 'success',
      data: payment
    };
  }

  /**
   * 查询支付订单
   */
  @Get('query')
  async queryPayment(@Query('orderId') orderId: string) {
    const payment = await this.wechatPayService.queryPaymentOrder(orderId);

    return {
      status: 'success',
      data: payment
    };
  }

  /**
   * 支付回调
   */
  @Post('callback')
  async paymentCallback(@Body() callbackData: any) {
    const result = await this.wechatPayService.handlePaymentCallback(callbackData);

    return {
      code: 'SUCCESS',
      message: '处理成功'
    };
  }

  /**
   * 申请退款
   */
  @Post('refund')
  async createRefund(@Body() refundDto: RefundDto) {
    const refund = await this.wechatPayService.refund(
      refundDto.orderId,
      refundDto.transactionId,
      refundDto.refundAmount,
      refundDto.totalAmount
    );

    return {
      status: 'success',
      data: refund
    };
  }
}

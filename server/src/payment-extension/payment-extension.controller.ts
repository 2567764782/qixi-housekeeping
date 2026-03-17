import { Controller, Post, Get, Body, Query, Headers, UseGuards } from '@nestjs/common';
import { PaymentExtensionService } from './payment-extension.service';
import { IsString, IsNumber, IsOptional, Min, IsIn, IsNotEmpty, validate } from 'class-validator';
import { Public } from '../decorators/public.decorator';

class RechargeDto {
  @IsNumber()
  @Min(10)
  amount: number;

  @IsString()
  @IsIn(['wechat', 'alipay'])
  paymentMethod: string;
}

class ClaimCouponDto {
  @IsString()
  @IsNotEmpty()
  couponId: string;
}

class SetPaymentPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

class VerifyPaymentPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('payment')
export class PaymentExtensionController {
  constructor(private readonly paymentExtensionService: PaymentExtensionService) {}

  /**
   * 获取用户余额
   */
  @Get('balance')
  async getBalance(@Headers('authorization') auth: string) {
    const userId = this.extractUserId(auth);
    const balance = await this.paymentExtensionService.getUserBalance(userId);
    return {
      code: 200,
      msg: 'success',
      data: balance,
    };
  }

  /**
   * 充值
   */
  @Post('recharge')
  async recharge(
    @Headers('authorization') auth: string,
    @Body() body: RechargeDto,
  ) {
    const userId = this.extractUserId(auth);
    const result = await this.paymentExtensionService.recharge(
      userId,
      body.amount,
      body.paymentMethod,
    );
    return {
      code: 200,
      msg: '充值成功',
      data: result,
    };
  }

  /**
   * 获取可用优惠券列表
   */
  /**
   * 获取可用优惠券列表
   */
  @Public()
  @Get('coupons/available')
  async getAvailableCoupons() {
    const coupons = await this.paymentExtensionService.getAvailableCoupons();
    return {
      code: 200,
      msg: 'success',
      data: coupons,
    };
  }

  /**
   * 获取用户优惠券
   */
  @Get('coupons/my')
  async getUserCoupons(@Headers('authorization') auth: string) {
    const userId = this.extractUserId(auth);
    const coupons = await this.paymentExtensionService.getUserCoupons(userId);
    return {
      code: 200,
      msg: 'success',
      data: coupons,
    };
  }

  /**
   * 领取优惠券
   */
  @Post('coupons/claim')
  async claimCoupon(
    @Headers('authorization') auth: string,
    @Body() body: ClaimCouponDto,
  ) {
    const userId = this.extractUserId(auth);
    const result = await this.paymentExtensionService.claimCoupon(userId, body.couponId);
    return {
      code: 200,
      msg: '领取成功',
      data: result,
    };
  }

  /**
   * 设置支付密码
   */
  @Post('password/set')
  async setPaymentPassword(
    @Headers('authorization') auth: string,
    @Body() body: SetPaymentPasswordDto,
  ) {
    if (body.password !== body.confirmPassword) {
      return {
        code: 400,
        msg: '两次密码不一致',
        data: null,
      };
    }

    if (body.password.length !== 6 || !/^\d{6}$/.test(body.password)) {
      return {
        code: 400,
        msg: '支付密码必须是6位数字',
        data: null,
      };
    }

    const userId = this.extractUserId(auth);
    await this.paymentExtensionService.setPaymentPassword(userId, body.password);
    return {
      code: 200,
      msg: '设置成功',
      data: null,
    };
  }

  /**
   * 验证支付密码
   */
  @Post('password/verify')
  async verifyPaymentPassword(
    @Headers('authorization') auth: string,
    @Body() body: VerifyPaymentPasswordDto,
  ) {
    const userId = this.extractUserId(auth);
    const valid = await this.paymentExtensionService.verifyPaymentPassword(userId, body.password);
    
    if (valid) {
      return {
        code: 200,
        msg: '验证成功',
        data: { valid: true },
      };
    } else {
      return {
        code: 400,
        msg: '支付密码错误',
        data: { valid: false },
      };
    }
  }

  /**
   * 检查是否有支付密码
   */
  @Get('password/has')
  async hasPaymentPassword(@Headers('authorization') auth: string) {
    const userId = this.extractUserId(auth);
    const hasPassword = await this.paymentExtensionService.hasPaymentPassword(userId);
    return {
      code: 200,
      msg: 'success',
      data: { hasPassword },
    };
  }

  /**
   * 计算支付优惠
   */
  @Post('calculate-discount')
  async calculateDiscount(
    @Headers('authorization') auth: string,
    @Body() body: { amount: number; couponId?: string; memberType?: string },
  ) {
    const userId = this.extractUserId(auth);
    const result = await this.paymentExtensionService.calculateDiscount(
      userId,
      body.amount,
      body.couponId,
      body.memberType,
    );
    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }

  /**
   * 创建分期付款
   */
  @Post('installment/create')
  async createInstallment(
    @Headers('authorization') auth: string,
    @Body() body: { orderId: string; totalAmount: number; periods: number },
  ) {
    const userId = this.extractUserId(auth);
    const result = await this.paymentExtensionService.createInstallment(
      userId,
      body.orderId,
      body.totalAmount,
      body.periods,
    );
    return {
      code: 200,
      msg: '创建成功',
      data: result,
    };
  }

  /**
   * 获取分期详情
   */
  @Get('installment/detail')
  async getInstallmentDetail(@Query('installmentId') installmentId: string) {
    const detail = await this.paymentExtensionService.getInstallmentDetail(installmentId);
    return {
      code: 200,
      msg: 'success',
      data: detail,
    };
  }

  /**
   * 支付分期
   */
  @Post('installment/pay')
  async payInstallment(
    @Headers('authorization') auth: string,
    @Body() body: { installmentId: string; periodNumber: number },
  ) {
    const userId = this.extractUserId(auth);
    const result = await this.paymentExtensionService.payInstallment(
      userId,
      body.installmentId,
      body.periodNumber,
    );
    return {
      code: 200,
      msg: '支付成功',
      data: result,
    };
  }

  // 从token中提取用户ID（简化实现）
  private extractUserId(auth: string): string {
    // 实际项目中应该从JWT token中解析
    // 这里简化处理，返回一个默认用户ID
    return 'default-user-id';
  }
}

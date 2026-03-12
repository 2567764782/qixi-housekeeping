import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WechatPayService } from './wechat-pay.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [WechatPayService],
  exports: [WechatPayService]
})
export class PaymentModule {}

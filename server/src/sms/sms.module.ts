import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SmsService } from './sms.service'
import { SmsController } from './sms.controller'
import { AliyunSmsService } from './aliyun-sms.service'

@Module({
  imports: [ConfigModule],
  controllers: [SmsController],
  providers: [SmsService, AliyunSmsService],
  exports: [SmsService, AliyunSmsService],
})
export class SmsModule {}

import { Module } from '@nestjs/common'
import { SmsService } from './sms.service'
import { SmsController } from './sms.controller'
import { RedisModule } from '@nestjs-modules/ioredis'

@Module({
  imports: [RedisModule],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}

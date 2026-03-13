import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { AliyunSmsService } from './aliyun-sms.service'

@Injectable()
export class SmsService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly aliyunSmsService: AliyunSmsService,
  ) {}

  /**
   * 生成 6 位数字验证码
   */
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string }> {
    const code = this.generateCode()
    const key = `sms:code:${phone}`

    // 将验证码存储到 Redis，有效期 5 分钟
    await this.redis.setex(key, 300, code)

    // 发送短信（优先使用阿里云，失败则使用模拟）
    const useAliyun = process.env.USE_ALIYUN_SMS !== 'false'

    if (useAliyun) {
      const sent = await this.aliyunSmsService.sendVerificationCode(phone, code)

      if (!sent) {
        console.log(`[SMS] 阿里云短信发送失败，使用模拟发送`)
        // TODO: 可以在这里添加备用短信服务
      }
    } else {
      console.log(`[SMS] 模拟发送验证码到 ${phone}: ${code}`)
    }

    return { success: true, code }
  }

  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const key = `sms:code:${phone}`
    const storedCode = await this.redis.get(key)

    if (!storedCode) {
      return false
    }

    const isValid = storedCode === code

    // 验证成功后删除验证码
    if (isValid) {
      await this.redis.del(key)
    }

    return isValid
  }

  /**
   * 检查是否可以发送验证码（限制发送频率，1 分钟内只能发送 1 次）
   */
  async canSendCode(phone: string): Promise<boolean> {
    const key = `sms:limit:${phone}`
    const count = await this.redis.get(key)

    if (count) {
      return false
    }

    // 设置限制，1 分钟内不能再次发送
    await this.redis.setex(key, 60, '1')

    return true
  }
}

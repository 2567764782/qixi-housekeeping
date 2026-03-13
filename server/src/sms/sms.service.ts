import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class SmsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * 生成 6 位数字验证码
   */
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * 发送验证码（模拟短信发送）
   * 实际项目中应该对接阿里云短信、腾讯云短信等服务
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string }> {
    const code = this.generateCode()
    const key = `sms:code:${phone}`

    // 将验证码存储到 Redis，有效期 5 分钟
    await this.redis.setex(key, 300, code)

    // TODO: 实际项目中应该调用短信服务 API
    console.log(`[SMS] 发送验证码到 ${phone}: ${code}`)

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

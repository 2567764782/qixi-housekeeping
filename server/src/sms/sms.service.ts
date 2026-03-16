import { Injectable, Logger } from '@nestjs/common'
import { AliyunSmsService } from './aliyun-sms.service'

const logger = new Logger('SmsService');

// 内存存储替代方案（当 Redis 不可用时）
class MemoryStore {
  private store: Map<string, { value: string; expireAt: number }> = new Map();

  async setex(key: string, ttl: number, value: string): Promise<void> {
    this.store.set(key, { value, expireAt: Date.now() + ttl * 1000 });
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expireAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

@Injectable()
export class SmsService {
  private readonly store: MemoryStore;
  private readonly useRedis: boolean = false;

  constructor(
    private readonly aliyunSmsService: AliyunSmsService,
  ) {
    // 默认使用内存存储
    this.store = new MemoryStore();
    logger.log('Using in-memory store for SMS codes (Redis not available)');
  }

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

    // 将验证码存储，有效期 5 分钟
    await this.store.setex(key, 300, code)

    // 发送短信（优先使用阿里云，失败则使用模拟）
    const useAliyun = process.env.USE_ALIYUN_SMS !== 'false'

    if (useAliyun) {
      const sent = await this.aliyunSmsService.sendVerificationCode(phone, code)

      if (!sent) {
        logger.log(`阿里云短信发送失败，使用模拟发送`)
        // TODO: 可以在这里添加备用短信服务
      }
    } else {
      logger.log(`模拟发送验证码到 ${phone}: ${code}`)
    }

    return { success: true, code }
  }

  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const key = `sms:code:${phone}`
    const storedCode = await this.store.get(key)

    if (!storedCode) {
      return false
    }

    const isValid = storedCode === code

    // 验证成功后删除验证码
    if (isValid) {
      await this.store.del(key)
    }

    return isValid
  }

  /**
   * 检查是否可以发送验证码（限制发送频率，1 分钟内只能发送 1 次）
   */
  async canSendCode(phone: string): Promise<boolean> {
    const key = `sms:limit:${phone}`
    const count = await this.store.get(key)

    if (count) {
      return false
    }

    // 设置限制，1 分钟内不能再次发送
    await this.store.setex(key, 60, '1')

    return true
  }
}

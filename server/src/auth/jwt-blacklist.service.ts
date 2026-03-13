import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class JwtBlacklistService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * 将 token 加入黑名单
   * @param token JWT token
   * @param expiresIn token 剩余有效期（秒）
   */
  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    const key = `jwt:blacklist:${token}`
    await this.redis.setex(key, expiresIn, '1')
  }

  /**
   * 检查 token 是否在黑名单中
   * @param token JWT token
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const key = `jwt:blacklist:${token}`
    const result = await this.redis.get(key)
    return result !== null
  }

  /**
   * 从黑名单中移除 token
   * @param token JWT token
   */
  async removeFromBlacklist(token: string): Promise<void> {
    const key = `jwt:blacklist:${token}`
    await this.redis.del(key)
  }

  /**
   * 清空所有黑名单
   */
  async clearBlacklist(): Promise<void> {
    const keys = await this.redis.keys('jwt:blacklist:*')
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  /**
   * 获取黑名单中的 token 数量
   */
  async getBlacklistSize(): Promise<number> {
    const keys = await this.redis.keys('jwt:blacklist:*')
    return keys.length
  }
}

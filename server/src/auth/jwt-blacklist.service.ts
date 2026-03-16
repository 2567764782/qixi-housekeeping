import { Injectable, Logger } from '@nestjs/common'

const logger = new Logger('JwtBlacklistService');

// 内存存储替代方案（当 Redis 不可用时）
class MemoryBlacklistStore {
  private store: Map<string, { expireAt: number }> = new Map();

  async setex(key: string, ttl: number, value: string): Promise<void> {
    this.store.set(key, { expireAt: Date.now() + ttl * 1000 });
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expireAt) {
      this.store.delete(key);
      return null;
    }
    return '1';
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async keys(pattern: string): Promise<string[]> {
    // 简单模式匹配
    const prefix = pattern.replace('*', '');
    const result: string[] = [];
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        const item = this.store.get(key);
        if (item && Date.now() <= item.expireAt) {
          result.push(key);
        } else if (item) {
          this.store.delete(key);
        }
      }
    }
    return result;
  }
}

@Injectable()
export class JwtBlacklistService {
  private readonly store: MemoryBlacklistStore;

  constructor() {
    this.store = new MemoryBlacklistStore();
    logger.log('Using in-memory store for JWT blacklist (Redis not available)');
  }

  /**
   * 将 token 加入黑名单
   * @param token JWT token
   * @param expiresIn token 剩余有效期（秒）
   */
  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    const key = `jwt:blacklist:${token}`
    await this.store.setex(key, expiresIn, '1')
  }

  /**
   * 检查 token 是否在黑名单中
   * @param token JWT token
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const key = `jwt:blacklist:${token}`
    const result = await this.store.get(key)
    return result !== null
  }

  /**
   * 从黑名单中移除 token
   * @param token JWT token
   */
  async removeFromBlacklist(token: string): Promise<void> {
    const key = `jwt:blacklist:${token}`
    await this.store.del(key)
  }

  /**
   * 清空所有黑名单
   */
  async clearBlacklist(): Promise<void> {
    const keys = await this.store.keys('jwt:blacklist:*')
    for (const key of keys) {
      await this.store.del(key)
    }
  }

  /**
   * 获取黑名单中的 token 数量
   */
  async getBlacklistSize(): Promise<number> {
    const keys = await this.store.keys('jwt:blacklist:*')
    return keys.length
  }
}

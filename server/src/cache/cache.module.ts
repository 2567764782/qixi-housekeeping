import { Module, Global, Logger } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'

const logger = new Logger('CacheModule');

// 检查是否启用 Redis 缓存（默认禁用，使用内存缓存）
const USE_REDIS_CACHE = process.env.USE_REDIS_CACHE === 'true';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // 默认使用内存缓存，避免 Redis 连接问题
        if (!USE_REDIS_CACHE) {
          logger.log('Using in-memory cache (set USE_REDIS_CACHE=true to enable Redis)');
          return {
            ttl: 300, // 默认缓存时间 5 分钟
            max: 100, // 最大缓存项数
            isGlobal: true,
          };
        }

        // 如果启用 Redis，尝试连接
        const redisHost = configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = configService.get<number>('REDIS_PORT') || 6379;
        const redisPassword = configService.get<string>('REDIS_PASSWORD') || undefined;
        
        try {
          const redisStore = await import('cache-manager-ioredis');
          logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
          
          return {
            store: redisStore.default || redisStore,
            host: redisHost,
            port: redisPort,
            password: redisPassword || undefined,
            ttl: 300,
            max: 100,
            isGlobal: true,
          };
        } catch (error) {
          logger.warn('Redis not available, falling back to in-memory cache');
          return {
            ttl: 300,
            max: 100,
            isGlobal: true,
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}

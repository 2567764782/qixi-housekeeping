import { Module, Global } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-ioredis'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: configService.get<number>('REDIS_PORT') || 6379,
        password: configService.get<string>('REDIS_PASSWORD') || undefined,
        ttl: 300, // 默认缓存时间 5 分钟
        max: 100, // 最大缓存项数
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}

import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus'
import { Public } from '../decorators/public.decorator'

@Controller('health')
@Public()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      // Database health check
      () => this.db.pingCheck('database', { timeout: 1500 }),

      // Memory health check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB

      // Disk health check
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ])
  }

  @Get('liveness')
  @HealthCheck()
  liveness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024), // 1GB
    ])
  }

  @Get('readiness')
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      // Check if the app can connect to critical services
      () => this.db.pingCheck('database', { timeout: 1500 }),
    ])
  }
}

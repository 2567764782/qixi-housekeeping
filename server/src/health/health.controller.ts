import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
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
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
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
      // 简单的内存检查作为就绪探针
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024), // 200MB
    ])
  }
}

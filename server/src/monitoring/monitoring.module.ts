import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { MonitoringService } from './monitoring.service'
import { PrometheusMiddleware } from '../common/middleware/prometheus.middleware'
import { prometheusConfig } from './prometheus.config'

@Module({
  imports: [prometheusConfig],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrometheusMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}


import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MonitoringService } from './monitoring.service'
import { PrometheusMiddleware } from '../common/middleware/prometheus.middleware'
import { AlertManagerService } from './alert-manager.service'
import { AlertManagerController } from './alert-manager.controller'
import { prometheusConfig } from './prometheus.config'
import { NotificationModule } from '../notifications/notifications.module'

@Module({
  imports: [prometheusConfig, ScheduleModule.forRoot(), NotificationModule],
  providers: [MonitoringService, PrometheusMiddleware, AlertManagerService],
  controllers: [AlertManagerController],
  exports: [MonitoringService, PrometheusMiddleware, AlertManagerService],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrometheusMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}


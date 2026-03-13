import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { MonitoringService } from '../../monitoring/monitoring.service'

@Injectable()
export class PrometheusMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PrometheusMiddleware.name)

  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()
    const { method, originalUrl } = req

    // Increment active HTTP connections
    this.monitoringService.incrementActiveConnections('http')

    // Log request
    this.logger.log(`${method} ${originalUrl}`)

    // Hook into response finish to record metrics
    res.on('finish', () => {
      const duration = Date.now() - start
      const statusCode = res.statusCode

      // Record request metrics
      this.monitoringService.incrementHttpRequest(method, originalUrl, statusCode)
      this.monitoringService.recordHttpRequestDuration(method, originalUrl, statusCode, duration)

      // Decrement active HTTP connections
      this.monitoringService.decrementActiveConnections('http')

      // Log response
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`)
    })

    next()
  }
}

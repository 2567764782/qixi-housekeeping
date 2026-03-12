import { Injectable, NestMiddleware, LoggerService } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '../logger/logger.service'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger()

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req
    const userAgent = req.get('user-agent') || ''

    const startTime = Date.now()

    // 记录请求开始
    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
      'LoggerMiddleware',
    )

    // 监听响应完成
    res.on('finish', () => {
      const { statusCode } = res
      const duration = Date.now() - startTime
      const contentLength = res.get('content-length')

      // 记录请求完成
      const logMessage = `Request Completed: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - Content-Length: ${contentLength || 0}`

      if (statusCode >= 400) {
        this.logger.warn(logMessage, 'LoggerMiddleware')
      } else {
        this.logger.log(logMessage, 'LoggerMiddleware')
      }
    })

    next()
  }
}

import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger

  constructor() {
    const transports: winston.transport[] = [
      // 控制台输出
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message, context, trace }) => {
            return `${timestamp} [${context || 'Application'}] ${level}: ${message}${trace ? '\n' + trace : ''}`
          }),
        ),
      }),
      // 错误日志
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '30d',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.json(),
        ),
      }),
      // 所有日志
      new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.json(),
        ),
      }),
    ]

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      transports,
    })
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context })
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { context, trace })
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context })
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context })
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context })
  }
}

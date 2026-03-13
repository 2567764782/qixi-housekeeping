import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import { ElasticsearchTransport } from 'winston-elasticsearch'

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

    // 添加 Elasticsearch 传输（如果配置了）
    if (process.env.ELASTICSEARCH_NODE && process.env.ELASTICSEARCH_INDEX) {
      const esTransport = new ElasticsearchTransport({
        level: 'info',
        clientOpts: {
          node: process.env.ELASTICSEARCH_NODE,
        },
        index: process.env.ELASTICSEARCH_INDEX,
        dataStream: true,
      })

      transports.push(esTransport)
    }

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

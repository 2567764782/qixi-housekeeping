import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, LoggerService } from '@nestjs/common'
import { Request, Response } from 'express'
import { Logger } from '../logger/logger.service'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger()

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message
    } else if (exception instanceof Error) {
      message = exception.message
    }

    const errorResponse = {
      code: status,
      msg: message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : '',
      'HttpExceptionFilter',
    )

    response.status(status).json(errorResponse)
  }
}

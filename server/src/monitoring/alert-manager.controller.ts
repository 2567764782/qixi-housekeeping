import { Controller, Get, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AlertManagerService } from './alert-manager.service'
import { AlertNotification } from '../notifications/notification.service'
import { PrometheusAlert } from './alert-manager.types'

@ApiTags('alert-manager')
@Controller('alert-manager')
export class AlertManagerController {
  private readonly logger = new Logger(AlertManagerController.name)

  constructor(private readonly alertManagerService: AlertManagerService) {}

  @Get('alerts')
  @ApiOperation({ summary: '获取活跃告警' })
  @ApiResponse({ status: 200, description: '返回活跃告警列表' })
  async getActiveAlerts() {
    try {
      const alerts = await this.alertManagerService.getActiveAlerts()
      return {
        code: 200,
        msg: 'success',
        data: {
          alerts,
          count: alerts.length,
        },
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取活跃告警失败，请稍后重试' : (error.message || '获取活跃告警失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('trigger')
  @ApiOperation({ summary: '手动触发告警' })
  @ApiResponse({ status: 200, description: '告警已触发' })
  async triggerAlert(@Body() notification: AlertNotification) {
    try {
      // 验证必填字段
      if (!notification.title || typeof notification.title !== 'string' || notification.title.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '告警标题不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!notification.message || typeof notification.message !== 'string' || notification.message.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '告警消息不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (!notification.severity || typeof notification.severity !== 'string' || notification.severity.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '告警级别不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      await this.alertManagerService.triggerAlert(notification)
      return {
        code: 200,
        msg: '告警已触发',
        data: null
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '触发告警失败，请稍后重试' : (error.message || '触发告警失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('stats')
  @ApiOperation({ summary: '获取已处理告警统计' })
  @ApiResponse({ status: 200, description: '返回统计信息' })
  async getProcessedAlertsStats() {
    try {
      const stats = this.alertManagerService.getProcessedAlertsStats()
      return {
        code: 200,
        msg: 'success',
        data: stats,
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取告警统计失败，请稍后重试' : (error.message || '获取告警统计失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('clear')
  @ApiOperation({ summary: '清空已处理告警记录' })
  @ApiResponse({ status: 200, description: '已清空' })
  async clearProcessedAlerts() {
    try {
      await this.alertManagerService.clearProcessedAlerts()
      return {
        code: 200,
        msg: '已处理告警记录已清空',
        data: null
      }
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '清空告警记录失败，请稍后重试' : (error.message || '清空告警记录失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

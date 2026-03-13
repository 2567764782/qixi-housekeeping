import { Controller, Get, Post, Body, Logger } from '@nestjs/common'
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
    const alerts = await this.alertManagerService.getActiveAlerts()
    return {
      code: 200,
      data: {
        alerts,
        count: alerts.length,
      },
    }
  }

  @Post('trigger')
  @ApiOperation({ summary: '手动触发告警' })
  @ApiResponse({ status: 200, description: '告警已触发' })
  async triggerAlert(@Body() notification: AlertNotification) {
    await this.alertManagerService.triggerAlert(notification)
    return {
      code: 200,
      msg: '告警已触发',
    }
  }

  @Get('stats')
  @ApiOperation({ summary: '获取已处理告警统计' })
  @ApiResponse({ status: 200, description: '返回统计信息' })
  async getProcessedAlertsStats() {
    const stats = this.alertManagerService.getProcessedAlertsStats()
    return {
      code: 200,
      data: stats,
    }
  }

  @Post('clear')
  @ApiOperation({ summary: '清空已处理告警记录' })
  @ApiResponse({ status: 200, description: '已清空' })
  async clearProcessedAlerts() {
    await this.alertManagerService.clearProcessedAlerts()
    return {
      code: 200,
      msg: '已处理告警记录已清空',
    }
  }
}

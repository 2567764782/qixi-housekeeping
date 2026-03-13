import { Controller, Get, Post, Body, Put, Param, Logger } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { NotificationService, AlertNotification, NotificationChannel } from './notification.service'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name)

  constructor(private readonly notificationService: NotificationService) {}

  @Post('alert')
  @ApiOperation({ summary: '发送告警通知' })
  @ApiResponse({ status: 200, description: '通知已发送' })
  async sendAlert(@Body() notification: AlertNotification) {
    await this.notificationService.sendAlert(notification)
    return { code: 200, msg: '通知已发送' }
  }

  @Post('test')
  @ApiOperation({ summary: '测试通知' })
  @ApiResponse({ status: 200, description: '测试通知已发送' })
  async testNotification() {
    await this.notificationService.testNotification()
    return { code: 200, msg: '测试通知已发送' }
  }

  @Post('batch')
  @ApiOperation({ summary: '批量发送通知' })
  @ApiResponse({ status: 200, description: '批量通知已发送' })
  async sendBatchAlerts(@Body() notifications: AlertNotification[]) {
    await this.notificationService.sendBatchAlerts(notifications)
    return { code: 200, msg: `已发送 ${notifications.length} 条通知` }
  }

  @Get('channels')
  @ApiOperation({ summary: '获取所有通知渠道' })
  @ApiResponse({ status: 200, description: '返回通知渠道列表' })
  getChannels() {
    const channels: Record<string, NotificationChannel> = {}
    // 这里需要暴露渠道信息，实际使用时可能需要过滤敏感配置
    return { code: 200, data: channels }
  }

  @Put('channels/:channel')
  @ApiOperation({ summary: '更新通知渠道配置' })
  @ApiResponse({ status: 200, description: '渠道配置已更新' })
  updateChannel(@Param('channel') channelName: string, @Body() config: Partial<NotificationChannel>) {
    this.notificationService.updateChannel(channelName, config)
    return { code: 200, msg: `渠道 ${channelName} 配置已更新` }
  }

  @Put('channels/:channel/enabled')
  @ApiOperation({ summary: '启用/禁用通知渠道' })
  @ApiResponse({ status: 200, description: '渠道状态已更新' })
  setChannelEnabled(@Param('channel') channelName: string, @Body() body: { enabled: boolean }) {
    this.notificationService.setChannelEnabled(channelName, body.enabled)
    return { code: 200, msg: `渠道 ${channelName} 已${body.enabled ? '启用' : '禁用'}` }
  }
}

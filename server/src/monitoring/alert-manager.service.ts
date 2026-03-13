import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import axios from 'axios'
import { NotificationService, AlertNotification } from '../notifications/notification.service'
import { PrometheusAlert, PrometheusAlertsResponse } from './alert-manager.types'

@Injectable()
export class AlertManagerService implements OnModuleInit {
  private readonly logger = new Logger(AlertManagerService.name)
  private readonly alertmanagerUrl = process.env.ALERTMANAGER_URL || 'http://localhost:9093'
  private processedAlerts = new Set<string>()
  private readonly alertRetentionTime = 24 * 60 * 60 * 1000 // 24小时

  constructor(private readonly notificationService: NotificationService) {}

  async onModuleInit() {
    this.logger.log('AlertManagerService initialized')
    await this.cleanupOldAlerts()
  }

  /**
   * 定时清理已处理的告警记录
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOldAlerts() {
    this.logger.log('Cleaning up old alert records')
    // 这里可以根据需要实现清理逻辑
  }

  /**
   * 获取 Alertmanager 的活跃告警
   */
  async getActiveAlerts(): Promise<PrometheusAlert[]> {
    try {
      const response = await axios.get<PrometheusAlertsResponse>(
        `${this.alertmanagerUrl}/api/v1/alerts`,
        {
          params: {
            active: true,
          },
          timeout: 5000,
        },
      )

      return response.data.data.alerts
    } catch (error) {
      this.logger.error(`Failed to fetch alerts from Alertmanager: ${error.message}`)
      return []
    }
  }

  /**
   * 处理活跃告警
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async processActiveAlerts() {
    const alerts = await this.getActiveAlerts()

    for (const alert of alerts) {
      await this.handleAlert(alert)
    }
  }

  /**
   * 处理单个告警
   */
  private async handleAlert(alert: PrometheusAlert) {
    const alertKey = alert.fingerprint

    // 检查是否已处理
    if (this.processedAlerts.has(alertKey)) {
      return
    }

    // 根据告警级别决定是否发送通知
    const severity = alert.labels.severity || 'info'

    if (severity === 'warning' || severity === 'critical') {
      const notification: AlertNotification = {
        severity: severity as 'critical' | 'warning' | 'info',
        title: alert.annotations.summary || '告警',
        message: alert.annotations.description || alert.annotations.summary || '无详细信息',
        labels: alert.labels,
        timestamp: new Date(alert.startsAt),
      }

      await this.notificationService.sendAlert(notification)

      // 标记为已处理
      this.processedAlerts.add(alertKey)
      this.logger.log(`Alert processed: ${alertKey}`)

      // 设置定时清理
      setTimeout(() => {
        this.processedAlerts.delete(alertKey)
      }, this.alertRetentionTime)
    }
  }

  /**
   * 手动触发告警通知
   */
  async triggerAlert(notification: AlertNotification) {
    await this.notificationService.sendAlert(notification)
    return { success: true }
  }

  /**
   * 获取已处理的告警统计
   */
  getProcessedAlertsStats() {
    return {
      total: this.processedAlerts.size,
      retentionTime: this.alertRetentionTime,
    }
  }

  /**
   * 清空已处理的告警记录
   */
  clearProcessedAlerts() {
    this.processedAlerts.clear()
    this.logger.log('Processed alerts cleared')
    return { success: true }
  }
}

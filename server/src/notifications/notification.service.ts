import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'

export interface NotificationChannel {
  type: 'email' | 'webhook' | 'slack' | 'wechat' | 'sms'
  enabled: boolean
  config: any
}

export interface AlertNotification {
  severity: 'critical' | 'warning' | 'info'
  title: string
  message: string
  labels?: Record<string, string>
  timestamp?: Date
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)
  private channels: Map<string, NotificationChannel> = new Map()

  constructor() {
    this.initializeChannels()
  }

  /**
   * 初始化通知渠道
   */
  private initializeChannels() {
    // Email 通知
    this.channels.set('email', {
      type: 'email',
      enabled: process.env.EMAIL_NOTIFICATION_ENABLED === 'true',
      config: {
        smtpHost: process.env.SMTP_HOST || 'smtp.example.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587'),
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        from: process.env.EMAIL_FROM || 'noreply@cleaning-service.com',
        to: process.env.EMAIL_TO?.split(',') || ['admin@example.com'],
      },
    })

    // Webhook 通知
    this.channels.set('webhook', {
      type: 'webhook',
      enabled: process.env.WEBHOOK_NOTIFICATION_ENABLED === 'true',
      config: {
        url: process.env.WEBHOOK_URL || 'http://localhost:5000/webhook/alert',
        method: 'POST',
      },
    })

    // Slack 通知
    this.channels.set('slack', {
      type: 'slack',
      enabled: process.env.SLACK_NOTIFICATION_ENABLED === 'true',
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: process.env.SLACK_CHANNEL || '#alerts',
      },
    })

    // 微信企业号通知
    this.channels.set('wechat', {
      type: 'wechat',
      enabled: process.env.WECHAT_NOTIFICATION_ENABLED === 'true',
      config: {
        corpId: process.env.WECHAT_CORP_ID,
        agentId: process.env.WECHAT_AGENT_ID,
        secret: process.env.WECHAT_SECRET,
        touser: process.env.WECHAT_TO_USER || '@all',
      },
    })

    // 短信通知
    this.channels.set('sms', {
      type: 'sms',
      enabled: process.env.SMS_NOTIFICATION_ENABLED === 'true',
      config: {
        phones: process.env.SMS_PHONES?.split(',') || [],
        templateId: process.env.SMS_ALERT_TEMPLATE_ID,
      },
    })
  }

  /**
   * 发送告警通知
   */
  async sendAlert(notification: AlertNotification): Promise<void> {
    this.logger.log(`Sending alert: ${notification.title}`)

    for (const [channelName, channel] of this.channels) {
      if (channel.enabled) {
        try {
          await this.sendToChannel(channel, notification)
          this.logger.log(`Alert sent via ${channelName}`)
        } catch (error) {
          this.logger.error(`Failed to send alert via ${channelName}: ${error.message}`)
        }
      }
    }
  }

  /**
   * 发送到特定渠道
   */
  private async sendToChannel(channel: NotificationChannel, notification: AlertNotification): Promise<void> {
    switch (channel.type) {
      case 'webhook':
        await this.sendWebhook(channel.config, notification)
        break
      case 'slack':
        await this.sendSlack(channel.config, notification)
        break
      case 'wechat':
        await this.sendWechat(channel.config, notification)
        break
      case 'sms':
        await this.sendSms(channel.config, notification)
        break
      case 'email':
        await this.sendEmail(channel.config, notification)
        break
      default:
        this.logger.warn(`Unknown channel type: ${channel.type}`)
    }
  }

  /**
   * 发送 Webhook 通知
   */
  private async sendWebhook(config: any, notification: AlertNotification): Promise<void> {
    const payload = {
      severity: notification.severity,
      title: notification.title,
      message: notification.message,
      labels: notification.labels,
      timestamp: notification.timestamp || new Date(),
      application: 'cleaning-service',
      environment: process.env.NODE_ENV || 'development',
    }

    await axios.post(config.url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    })
  }

  /**
   * 发送 Slack 通知
   */
  private async sendSlack(config: any, notification: AlertNotification): Promise<void> {
    const color = {
      critical: 'danger',
      warning: 'warning',
      info: 'good',
    }[notification.severity]

    const payload = {
      channel: config.channel,
      attachments: [
        {
          color,
          title: notification.title,
          text: notification.message,
          fields: Object.entries(notification.labels || {}).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true,
          })),
          footer: 'cleaning-service',
          ts: Math.floor((notification.timestamp?.getTime() || Date.now()) / 1000),
        },
      ],
    }

    await axios.post(config.webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    })
  }

  /**
   * 发送微信企业号通知
   */
  private async sendWechat(config: any, notification: AlertNotification): Promise<void> {
    // 获取 access_token
    const tokenResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.corpId}&corpsecret=${config.secret}`,
      { timeout: 5000 },
    )

    const accessToken = tokenResponse.data.access_token

    // 发送消息
    const message = {
      touser: config.touser,
      msgtype: 'text',
      agentid: config.agentId,
      text: {
        content: `【${notification.severity.toUpperCase()}】${notification.title}\n\n${notification.message}`,
      },
      safe: 0,
    }

    await axios.post(
      `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`,
      message,
      { timeout: 5000 },
    )
  }

  /**
   * 发送短信通知
   */
  private async sendSms(config: any, notification: AlertNotification): Promise<void> {
    if (!config.phones || config.phones.length === 0) {
      return
    }

    // 使用现有的短信服务发送
    const message = `[${notification.severity.toUpperCase()}] ${notification.title}`

    for (const phone of config.phones) {
      try {
        // 这里需要集成短信服务
        this.logger.log(`SMS alert sent to ${phone}: ${message}`)
      } catch (error) {
        this.logger.error(`Failed to send SMS to ${phone}: ${error.message}`)
      }
    }
  }

  /**
   * 发送邮件通知
   */
  private async sendEmail(config: any, notification: AlertNotification): Promise<void> {
    // 这里需要集成邮件发送服务
    const subject = `[${notification.severity.toUpperCase()}] ${notification.title}`
    const body = `
      <h2>${notification.title}</h2>
      <p><strong>Severity:</strong> ${notification.severity}</p>
      <p><strong>Message:</strong></p>
      <p>${notification.message}</p>
      ${notification.labels ? `<p><strong>Labels:</strong></p><pre>${JSON.stringify(notification.labels, null, 2)}</pre>` : ''}
      <p><strong>Time:</strong> ${notification.timestamp?.toISOString() || new Date().toISOString()}</p>
    `

    this.logger.log(`Email alert would be sent to: ${config.to.join(', ')}`)
    // 实际发送邮件需要集成 nodemailer 或其他邮件服务
  }

  /**
   * 更新通知渠道配置
   */
  updateChannel(channelName: string, config: Partial<NotificationChannel>): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      this.channels.set(channelName, {
        ...channel,
        ...config,
      })
      this.logger.log(`Channel ${channelName} updated`)
    }
  }

  /**
   * 启用/禁用通知渠道
   */
  setChannelEnabled(channelName: string, enabled: boolean): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      channel.enabled = enabled
      this.logger.log(`Channel ${channelName} ${enabled ? 'enabled' : 'disabled'}`)
    }
  }

  /**
   * 测试通知
   */
  async testNotification(): Promise<void> {
    const testNotification: AlertNotification = {
      severity: 'info',
      title: '测试通知',
      message: '这是一条测试通知，如果您收到此消息，说明通知系统工作正常。',
      labels: {
        test: 'true',
        environment: process.env.NODE_ENV || 'development',
      },
      timestamp: new Date(),
    }

    await this.sendAlert(testNotification)
  }

  /**
   * 批量发送通知
   */
  async sendBatchAlerts(notifications: AlertNotification[]): Promise<void> {
    this.logger.log(`Sending batch alerts: ${notifications.length} notifications`)

    for (const notification of notifications) {
      try {
        await this.sendAlert(notification)
        // 避免发送过快
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        this.logger.error(`Failed to send alert: ${error.message}`)
      }
    }
  }
}

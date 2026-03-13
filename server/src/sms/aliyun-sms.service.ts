import { Injectable } from '@nestjs/common'
import Dysmsapi, * as Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as OpenApi from '@alicloud/openapi-client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AliyunSmsService {
  private client: Dysmsapi

  constructor(private readonly configService: ConfigService) {
    const config = new OpenApi.Config({
      accessKeyId: this.configService.get<string>('ALIYUN_ACCESS_KEY_ID') || '',
      accessKeySecret: this.configService.get<string>('ALIYUN_ACCESS_KEY_SECRET') || '',
      endpoint: 'dysmsapi.aliyuncs.com',
    })

    this.client = new Dysmsapi(config)
  }

  /**
   * 发送验证码短信
   */
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    try {
      const sendSmsRequest = new Dysmsapi20170525.SendSmsRequest({
        phoneNumbers: phone,
        signName: this.configService.get<string>('ALIYUN_SMS_SIGN_NAME') || '保洁服务',
        templateCode: this.configService.get<string>('ALIYUN_SMS_TEMPLATE_CODE') || 'SMS_123456789',
        templateParam: JSON.stringify({ code }),
      })

      const response = await this.client.sendSms(sendSmsRequest)

      if (response.body?.code === 'OK') {
        console.log(`[Aliyun SMS] 验证码已发送到 ${phone}: ${code}`)
        return true
      } else {
        console.error(`[Aliyun SMS] 发送失败: ${response.body?.message}`)
        return false
      }
    } catch (error) {
      console.error('[Aliyun SMS] 发送异常:', error)
      return false
    }
  }
}

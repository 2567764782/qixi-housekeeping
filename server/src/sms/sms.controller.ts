import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { SmsService } from './sms.service'
import { Public } from '../decorators/public.decorator'

interface SendSmsDto {
  phone: string
}

interface VerifyCodeDto {
  phone: string
  code: string
}

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  /**
   * 发送验证码
   */
  @Public()
  @Post('send-code')
  async sendCode(@Body() body: SendSmsDto) {
    const { phone } = body

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return {
        code: 400,
        msg: '手机号格式不正确',
        data: null,
      }
    }

    // 检查发送频率
    const canSend = await this.smsService.canSendCode(phone)

    if (!canSend) {
      return {
        code: 429,
        msg: '发送过于频繁，请 1 分钟后再试',
        data: null,
      }
    }

    // 发送验证码
    const result = await this.smsService.sendVerificationCode(phone)

    if (!result.success) {
      return {
        code: 500,
        msg: '发送验证码失败',
        data: null,
      }
    }

    return {
      code: 200,
      msg: '验证码已发送',
      data: {
        // 开发环境返回验证码，生产环境不返回
        code: process.env.NODE_ENV === 'development' ? result.code : undefined,
      },
    }
  }

  /**
   * 验证验证码
   */
  @Public()
  @Post('verify-code')
  async verifyCode(@Body() body: VerifyCodeDto) {
    const { phone, code } = body

    const isValid = await this.smsService.verifyCode(phone, code)

    if (!isValid) {
      return {
        code: 400,
        msg: '验证码错误或已过期',
        data: null,
      }
    }

    return {
      code: 200,
      msg: '验证码验证成功',
      data: null,
    }
  }
}

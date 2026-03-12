import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WechatService {
  private readonly appId: string;
  private readonly appSecret: string;
  private accessToken: string | null = null;
  private accessTokenExpiry: number = 0;

  constructor(private readonly httpService: HttpService) {
    this.appId = process.env.WECHAT_APP_ID || '';
    this.appSecret = process.env.WECHAT_APP_SECRET || '';

    if (!this.appId || !this.appSecret) {
      console.warn('WechatService: Missing WECHAT_APP_ID or WECHAT_APP_SECRET in environment variables');
    }
  }

  /**
   * 获取微信小程序 access_token
   */
  async getAccessToken(): Promise<string> {
    // 检查是否已有有效的 access_token
    if (this.accessToken && this.accessTokenExpiry > Date.now()) {
      return this.accessToken!;
    }

    try {
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
      const response = await firstValueFrom(this.httpService.get(url));

      if ((response.data as any).errcode) {
        throw new Error(`Failed to get access_token: ${(response.data as any).errmsg}`);
      }

      // 缓存 access_token，有效期为 7200 秒（2小时）
      // 我们提前 10 分钟刷新，确保 token 始终有效
      this.accessToken = (response.data as any).access_token;
      this.accessTokenExpiry = Date.now() + ((response.data as any).expires_in - 600) * 1000;

      console.log('WechatService: Access token refreshed successfully');
      return this.accessToken!;
    } catch (error) {
      console.error('WechatService: Failed to get access token', error);
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  /**
   * 发送订阅消息
   */
  async sendSubscribeMessage(openid: string, templateId: string, data: Record<string, any>, page?: string) {
    try {
      const accessToken = await this.getAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;

      const payload = {
        touser: openid,
        template_id: templateId,
        page: page || '',
        data: this.formatSubscribeData(data),
        miniprogram_state: 'formal' // 正式版
      };

      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      if ((response.data as any).errcode !== 0) {
        throw new Error(`Failed to send subscribe message: ${(response.data as any).errmsg}`);
      }

      console.log('WechatService: Subscribe message sent successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('WechatService: Failed to send subscribe message', error);
      throw new Error(`Failed to send subscribe message: ${error.message}`);
    }
  }

  /**
   * 格式化订阅消息数据
   * 微信小程序订阅消息的数据格式为：{ key1: { value: 'xxx' }, key2: { value: 'xxx' } }
   */
  private formatSubscribeData(data: Record<string, any>): Record<string, { value: string }> {
    const formatted: Record<string, { value: string }> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        formatted[key] = { value };
      } else if (typeof value === 'object' && value !== null) {
        formatted[key] = { value: value.value || String(value) };
      } else {
        formatted[key] = { value: String(value) };
      }
    }

    return formatted;
  }

  /**
   * 批量发送订阅消息
   */
  async sendBatchSubscribeMessage(
    openids: string[],
    templateId: string,
    data: Record<string, any>,
    page?: string
  ) {
    const results: Array<{ openid: string; success: boolean; data?: any; error?: string }> = [];

    for (const openid of openids) {
      try {
        const result = await this.sendSubscribeMessage(openid, templateId, data, page);
        results.push({ openid, success: true, data: result });
      } catch (error) {
        results.push({ openid, success: false, error: (error as Error).message });
      }
    }

    return results;
  }

  /**
   * 获取小程序码
   */
  async getUnlimitedQRCode(scene: string, page?: string): Promise<Buffer> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

      const payload = {
        scene: scene,
        page: page || '',
        width: 430,
        auto_color: false,
        line_color: { r: 0, g: 0, b: 0 },
        is_hyaline: false
      };

      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      return Buffer.from(response.data as any);
    } catch (error) {
      console.error('WechatService: Failed to get unlimited QR code', error);
      throw new Error(`Failed to get unlimited QR code: ${error.message}`);
    }
  }

  /**
   * 检查模板是否可用
   */
  async checkTemplateAvailability(templateId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `https://api.weixin.qq.com/wxaapi/newtmpl/gettemplate?access_token=${accessToken}`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { templateId }
        })
      );

      if ((response.data as any).errcode !== 0) {
        return false;
      }

      return ((response.data as any).data?.status) === 1;
    } catch (error) {
      console.error('WechatService: Failed to check template availability', error);
      return false;
    }
  }
}

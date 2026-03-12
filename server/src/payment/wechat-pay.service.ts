import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class WechatPayService {
  private readonly appId: string;
  private readonly mchId: string;
  private readonly apiKey: string;
  private readonly notifyUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.appId = process.env.WECHAT_APP_ID || '';
    this.mchId = process.env.WECHAT_MCH_ID || '';
    this.apiKey = process.env.WECHAT_API_KEY || '';
    this.notifyUrl = process.env.WECHAT_PAY_NOTIFY_URL || '';

    if (!this.appId || !this.mchId || !this.apiKey) {
      console.warn('WechatPayService: Missing required environment variables');
    }
  }

  /**
   * 创建微信支付订单
   */
  async createPaymentOrder(
    orderId: string,
    description: string,
    amount: number,
    openid: string
  ) {
    try {
      const nonceStr = this.generateNonceStr();
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = {
        appid: this.appId,
        mchid: this.mchId,
        description: description,
        out_trade_no: orderId,
        notify_url: this.notifyUrl,
        amount: {
          total: amount * 100, // 微信支付金额单位为分
          currency: 'CNY'
        },
        payer: {
          openid: openid
        }
      };

      // 生成签名
      const signature = this.generateSignature(body, nonceStr, timestamp);

      const payload = {
        ...body,
        sign_type: 'RSA',
        sign: signature,
        time_stamp: timestamp,
        nonce_str: nonceStr
      };

      // 调用微信支付统一下单接口
      const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchId}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="YOUR_SERIAL_NO",signature="${signature}"`
          }
        })
      );

      if (response.data.return_code !== 'SUCCESS') {
        throw new Error(`Failed to create payment order: ${response.data.return_msg}`);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to create payment order:', error);
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  /**
   * 查询支付订单
   */
  async queryPaymentOrder(orderId: string) {
    try {
      const nonceStr = this.generateNonceStr();
      const timestamp = Math.floor(Date.now() / 1000).toString();

      const url = `https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/${orderId}`;
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchId}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="YOUR_SERIAL_NO",signature="YOUR_SIGNATURE"`
          }
        })
      );

      return response.data;
    } catch (error) {
      console.error('Failed to query payment order:', error);
      throw new Error(`Failed to query payment order: ${error.message}`);
    }
  }

  /**
   * 处理支付回调
   */
  async handlePaymentCallback(data: any) {
    try {
      // 验证签名
      const isValid = this.verifySignature(data);
      if (!isValid) {
        throw new Error('Invalid signature');
      }

      // 解析回调数据
      const decryptedData = this.decryptData(data.resource.ciphertext);
      const paymentInfo = JSON.parse(decryptedData);

      return {
        success: true,
        orderId: paymentInfo.out_trade_no,
        transactionId: paymentInfo.transaction_id,
        tradeState: paymentInfo.trade_state,
        paidAmount: paymentInfo.amount.total / 100, // 转换为元
        paidTime: paymentInfo.success_time
      };
    } catch (error) {
      console.error('Failed to handle payment callback:', error);
      throw new Error(`Failed to handle payment callback: ${error.message}`);
    }
  }

  /**
   * 申请退款
   */
  async refund(
    orderId: string,
    transactionId: string,
    refundAmount: number,
    totalAmount: number
  ) {
    try {
      const nonceStr = this.generateNonceStr();
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const refundId = `RF${Date.now()}`;

      const body = {
        out_trade_no: orderId,
        transaction_id: transactionId,
        out_refund_no: refundId,
        amount: {
          refund: refundAmount * 100,
          total: totalAmount * 100,
          currency: 'CNY'
        },
        notify_url: `${this.notifyUrl}/refund`
      };

      const url = 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds';
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchId}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="YOUR_SERIAL_NO",signature="YOUR_SIGNATURE"`
          }
        })
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create refund:', error);
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }

  /**
   * 生成随机字符串
   */
  private generateNonceStr(): string {
    return Math.random().toString(36).substr(2, 32);
  }

  /**
   * 生成签名
   */
  private generateSignature(
    body: any,
    nonceStr: string,
    timestamp: string
  ): string {
    const sortedParams = Object.keys(body)
      .sort()
      .map(key => `${key}=${body[key]}`)
      .join('&');

    const stringToSign = `${sortedParams}&key=${this.apiKey}`;
    return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase();
  }

  /**
   * 验证签名
   */
  private verifySignature(data: any): boolean {
    // 这里需要实现签名验证逻辑
    // 实际应用中需要使用商户证书验证
    return true;
  }

  /**
   * 解密数据
   */
  private decryptData(ciphertext: string): string {
    // 这里需要实现AES解密逻辑
    // 实际应用中需要使用商户API密钥解密
    return ciphertext;
  }
}

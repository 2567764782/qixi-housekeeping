import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { WechatService } from '../wechat/wechat.service';
import { SendNotificationDto, CreateSubscriptionDto, NotificationType } from './dto/notifications.dto';

@Injectable()
export class NotificationsService {
  private readonly client = getSupabaseClient();

  constructor(private readonly wechatService: WechatService) {}

  // 创建订阅记录
  async createSubscription(subscriptionDto: CreateSubscriptionDto) {
    const { data, error } = await this.client
      .from('notification_subscriptions')
      .insert({
        user_id: subscriptionDto.userId,
        template_id: subscriptionDto.templateId,
        type: subscriptionDto.type,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    return data;
  }

  // 发送订阅消息
  async sendNotification(sendNotificationDto: SendNotificationDto) {
    const results: Array<any> = [];

    try {
      // 批量发送订阅消息
      const batchResults = await this.wechatService.sendBatchSubscribeMessage(
        sendNotificationDto.touser,
        sendNotificationDto.templateId,
        sendNotificationDto.data,
        sendNotificationDto.page
      );

      for (const result of batchResults) {
        // 记录每个接收者的发送结果
        const { data, error } = await this.client
          .from('notification_history')
          .insert({
            template_id: sendNotificationDto.templateId,
            touser: [(result as any).openid],
            page: sendNotificationDto.page,
            data: sendNotificationDto.data,
            status: (result as any).success ? 'sent' : 'failed',
            error_message: (result as any).success ? null : (result as any).error
          })
          .select()
          .single();

        results.push((result as any).success ? data : error);
      }

      return {
        status: 'success',
        message: `Notifications sent to ${sendNotificationDto.touser.length} users`,
        data: results
      };
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  // 查询推送记录
  async getPushRecords(orderId?: number, cleanerId?: number) {
    let query = this.client
      .from('order_pushes')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    if (cleanerId) {
      query = query.eq('cleaner_id', cleanerId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch push records: ${error.message}`);
    }

    return data || [];
  }

  // 查询用户的订阅列表
  async getUserSubscriptions(userId: string) {
    const { data, error } = await this.client
      .from('notification_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subscriptions: ${error.message}`);
    }

    return data || [];
  }

  // 取消订阅
  async cancelSubscription(subscriptionId: number) {
    const { error } = await this.client
      .from('notification_subscriptions')
      .update({ is_active: false })
      .eq('id', subscriptionId);

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    return { success: true };
  }

  // 发送订单匹配通知
  async sendOrderMatchedNotification(orderId: number, cleanerId: number) {
    // 获取订单信息
    const { data: order } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    // 获取保洁员信息
    const { data: cleaner } = await this.client
      .from('cleaners')
      .select('*')
      .eq('id', cleanerId)
      .single();

    if (!order || !cleaner) {
      throw new Error('Order or cleaner not found');
    }

    // 构建通知数据
    const notificationData = {
      thing1: { value: order.order_no }, // 订单号
      thing2: { value: order.service_detail }, // 服务类型
      date3: { value: new Date(order.scheduled_time).toLocaleDateString() }, // 预约日期
      thing4: { value: order.address } // 服务地址
    };

    // 发送通知（这里需要实际的保洁员 openid）
    return this.sendNotification({
      templateId: 'ORDER_MATCHED_TEMPLATE_ID', // 需要配置实际的模板ID
      touser: ['cleaner_openid'], // 需要实际的 openid
      page: `/pages/cleaner-orders/index?id=${orderId}`,
      data: notificationData
    });
  }

  // 发送订单状态更新通知
  async sendOrderStatusNotification(
    orderId: number,
    userId: number,
    status: string
  ) {
    // 获取订单信息
    const { data: order } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) {
      throw new Error('Order not found');
    }

    // 根据状态构建不同的通知数据
    let notificationData: Record<string, { value: string }> = {};
    let templateId = '';
    let page = '';

    switch (status) {
      case 'accepted':
        templateId = 'ORDER_ACCEPTED_TEMPLATE_ID';
        notificationData = {
          thing1: { value: String(order.order_no) },
          date2: { value: new Date().toLocaleDateString() },
          thing3: { value: '已接单' }
        };
        page = `/pages/order-detail/index?id=${orderId}`;
        break;
      case 'in_progress':
        templateId = 'ORDER_IN_PROGRESS_TEMPLATE_ID';
        notificationData = {
          thing1: { value: String(order.order_no) },
          date2: { value: new Date().toLocaleDateString() },
          thing3: { value: '进行中' }
        };
        page = `/pages/order-detail/index?id=${orderId}`;
        break;
      case 'completed':
        templateId = 'ORDER_COMPLETED_TEMPLATE_ID';
        notificationData = {
          thing1: { value: String(order.order_no) },
          date2: { value: new Date().toLocaleDateString() },
          thing3: { value: '已完成' }
        };
        page = `/pages/order-detail/index?id=${orderId}`;
        break;
      default:
        throw new Error('Invalid status');
    }

    // 发送通知（这里需要实际的客户 openid）
    return this.sendNotification({
      templateId,
      touser: ['customer_openid'], // 需要实际的 openid
      page,
      data: notificationData
    });
  }
}

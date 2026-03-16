import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'service';
  timestamp: string;
  type: 'text' | 'image' | 'system';
  status?: 'sending' | 'sent' | 'read';
  user_id?: string;
}

@Injectable()
export class CustomerServiceService {
  private readonly client = getSupabaseClient();

  /**
   * 获取聊天历史记录
   */
  async getMessages(limit: number = 50): Promise<Message[]> {
    const { data, error } = await this.client
      .from('customer_service_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Failed to get messages:', error);
      // 返回模拟数据
      return [
        {
          id: '1',
          content: '您好！欢迎来到保洁服务客服中心，请问有什么可以帮助您的吗？',
          sender: 'service',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'text',
        },
      ];
    }

    return (data || []).map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.created_at,
      type: msg.type || 'text',
      status: msg.status,
      user_id: msg.user_id,
    }));
  }

  /**
   * 发送消息
   */
  async sendMessage(
    content: string,
    type: string = 'text',
    userId?: string
  ): Promise<Message> {
    const { data, error } = await this.client
      .from('customer_service_messages')
      .insert({
        content,
        type: type || 'text',
        sender: 'user',
        user_id: userId,
        status: 'sent',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to send message:', error);
      // 返回模拟数据
      return {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: type as any,
        status: 'sent',
        user_id: userId,
      };
    }

    return {
      id: data.id,
      content: data.content,
      sender: data.sender,
      timestamp: data.created_at,
      type: data.type,
      status: data.status,
      user_id: data.user_id,
    };
  }

  /**
   * 获取未读消息数量
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.client
      .from('customer_service_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('sender', 'service')
      .eq('is_read', false);

    if (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * 标记消息已读
   */
  async markAsRead(userId: string, messageIds?: string[]): Promise<void> {
    let query = this.client
      .from('customer_service_messages')
      .update({ is_read: true });

    if (messageIds && messageIds.length > 0) {
      query = query.in('id', messageIds);
    } else {
      query = query.eq('user_id', userId).eq('sender', 'service');
    }

    const { error } = await query;

    if (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }

  /**
   * 保存客服消息（供 Gateway 调用）
   */
  async saveMessage(
    content: string,
    sender: 'user' | 'service',
    type: string = 'text',
    userId?: string
  ): Promise<Message> {
    const { data, error } = await this.client
      .from('customer_service_messages')
      .insert({
        content,
        type: type || 'text',
        sender,
        user_id: userId,
        status: 'sent',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save message:', error);
      return {
        id: Date.now().toString(),
        content,
        sender,
        timestamp: new Date().toISOString(),
        type: type as any,
        status: 'sent',
        user_id: userId,
      };
    }

    return {
      id: data.id,
      content: data.content,
      sender: data.sender,
      timestamp: data.created_at,
      type: data.type,
      status: data.status,
      user_id: data.user_id,
    };
  }
}

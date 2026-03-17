import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class PaymentService {
  private readonly client = getSupabaseClient();

  /**
   * 创建支付订单
   */
  async createPayment(orderId: string, userId: string, amount: number, method: string = 'wechat') {
    // 检查订单是否存在
    const { data: order, error: orderError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('订单不存在');
    }

    if (order.payment_status === 'paid') {
      throw new Error('订单已支付');
    }

    // 创建支付记录
    const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    const { data: payment, error } = await this.client
      .from('payments')
      .insert({
        id: paymentId,
        order_id: orderId,
        user_id: userId,
        amount: amount,
        payment_method: method,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建支付记录失败: ${error.message}`);
    }

    return {
      paymentId: payment.id,
      amount: amount,
      orderId: orderId
    };
  }

  /**
   * 模拟支付（开发测试用）
   */
  async mockPayment(paymentId: string, userId: string) {
    // 获取支付记录
    const { data: payment, error: paymentError } = await this.client
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      throw new Error('支付记录不存在');
    }

    if (payment.status !== 'pending') {
      throw new Error('支付状态异常');
    }

    // 生成模拟交易号
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 8)}`;

    // 更新支付状态
    const { data: updatedPayment, error } = await this.client
      .from('payments')
      .update({
        status: 'success',
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      throw new Error(`支付失败: ${error.message}`);
    }

    // 更新订单支付状态
    await this.client
      .from('cleaning_orders')
      .update({
        payment_status: 'paid',
        payment_id: paymentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.order_id);

    return {
      success: true,
      transactionId: transactionId,
      paidAt: updatedPayment.paid_at
    };
  }

  /**
   * 查询支付状态
   */
  async queryPayment(paymentId: string) {
    const { data: payment, error } = await this.client
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) {
      throw new Error('支付记录不存在');
    }

    return payment;
  }

  /**
   * 根据订单ID查询支付
   */
  async queryPaymentByOrderId(orderId: string) {
    const { data: payment, error } = await this.client
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return null;
    }

    return payment;
  }

  /**
   * 申请退款
   */
  async refund(orderId: string, userId: string, reason?: string) {
    // 获取支付记录
    const { data: payment } = await this.client
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'success')
      .single();

    if (!payment) {
      throw new Error('未找到有效的支付记录');
    }

    // 创建退款记录
    const refundId = `REF${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    // 更新支付状态为退款中
    await this.client
      .from('payments')
      .update({
        status: 'refunding',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    // 模拟退款成功
    const { data: refundedPayment, error } = await this.client
      .from('payments')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)
      .select()
      .single();

    if (error) {
      throw new Error('退款失败');
    }

    // 更新订单状态
    await this.client
      .from('cleaning_orders')
      .update({
        payment_status: 'refunded',
        status: 'cancelled',
        cancel_reason: reason || '用户申请退款',
        cancelled_at: new Date().toISOString(),
        cancelled_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return {
      success: true,
      refundId: refundId,
      refundAmount: payment.amount
    };
  }

  /**
   * 获取用户支付记录列表
   */
  async getUserPayments(userId: string, page: number = 1, pageSize: number = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.client
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error('获取支付记录失败');
    }

    return {
      list: data || [],
      total: count || 0,
      page,
      pageSize
    };
  }
}

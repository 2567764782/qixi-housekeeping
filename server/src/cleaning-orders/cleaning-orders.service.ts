import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import {
  CreateOrderDto,
  VerifyOrderDto,
  MatchOrderDto,
  OrderStatus
} from './dto/cleaning-orders.dto';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class CleaningOrdersService {
  private readonly client = getSupabaseClient();

  async createOrder(createOrderDto: CreateOrderDto) {
    const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const { data, error } = await this.client
      .from('cleaning_orders')
      .insert({
        order_no: orderNo,
        customer_id: createOrderDto.customerId,
        customer_name: createOrderDto.customerName,
        customer_phone: createOrderDto.customerPhone,
        service_type: createOrderDto.serviceType,
        service_detail: createOrderDto.serviceDetail,
        address: createOrderDto.address,
        latitude: createOrderDto.latitude,
        longitude: createOrderDto.longitude,
        scheduled_time: createOrderDto.scheduledTime,
        estimated_duration: createOrderDto.estimatedDuration,
        budget_min: createOrderDto.budgetMin,
        budget_max: createOrderDto.budgetMax,
        special_requirements: createOrderDto.specialRequirements,
        status: OrderStatus.PENDING_REVIEW
      })
      .select()
      .single();

    if (error) {
      throw new ConflictException(`Failed to create order: ${error.message}`);
    }

    return data;
  }

  async getPendingReviewOrders() {
    const { data, error } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('status', OrderStatus.PENDING_REVIEW)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return data || [];
  }

  async verifyOrder(orderId: number, verifyDto: VerifyOrderDto, adminId: number) {
    const { data, error } = await this.client
      .from('cleaning_orders')
      .update({
        status: verifyDto.status,
        verification_notes: verifyDto.verificationNotes,
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException(`Order not found: ${error.message}`);
    }

    return data;
  }

  async matchCleaner(orderId: number, matchDto: MatchOrderDto) {
    const { data: orderData, error: orderError } = await this.client
      .from('cleaning_orders')
      .update({
        status: 'matched',
        matched_cleaner_id: matchDto.cleanerId,
        matched_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('status', 'verified')
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error('订单不存在或状态不正确');
    }

    // 创建推送记录
    await this.createPushRecord(orderId, matchDto.cleanerId);

    return orderData;
  }

  async acceptOrder(orderId: number, cleanerId: number) {
    const { data: orderData, error: orderError } = await this.client
      .from('cleaning_orders')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('matched_cleaner_id', cleanerId)
      .eq('status', 'matched')
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error('订单不存在或状态不正确');
    }

    // 更新推送记录状态
    await this.updatePushStatus(orderId, cleanerId, 'accepted');

    return orderData;
  }

  async getMatchedCleaners(orderId: number) {
    // 获取订单信息
    const { data: order, error: orderError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('订单不存在');
    }

    // 查找匹配的保洁员
    const { data: cleaners, error: cleanersError } = await this.client
      .from('cleaners')
      .select('*')
      .eq('is_online', true)
      .eq('is_verified', true)
      .contains('service_types', [order.service_type])
      .order('rating', { ascending: false })
      .order('completed_orders', { ascending: false })
      .limit(20);

    if (cleanersError) {
      throw new Error(`Failed to fetch cleaners: ${cleanersError.message}`);
    }

    // 计算距离和匹配度
    const matchedCleaners = (cleaners || []).map(cleaner => {
      let distance: number | null = null;
      if (order.latitude && order.longitude && cleaner.latitude && cleaner.longitude) {
        const latDiff = order.latitude - cleaner.latitude;
        const lonDiff = order.longitude - cleaner.longitude;
        distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111;
      }

      return {
        ...cleaner,
        distance,
        matchScore: this.calculateMatchScore(order, cleaner, distance)
      };
    });

    // 按匹配度排序
    matchedCleaners.sort((a, b) => b.matchScore - a.matchScore);

    return matchedCleaners.slice(0, 10);
  }

  private calculateMatchScore(order: any, cleaner: any, distance: number | null): number {
    let score = 100;

    // 距离评分
    if (distance !== null && distance !== undefined) {
      score -= Math.min(distance * 10, 50);
    }

    // 评分影响
    score += cleaner.rating * 10;

    // 完成订单数影响
    score += Math.min(cleaner.completed_orders, 50);

    return score;
  }

  private async createPushRecord(orderId: number, cleanerId: number) {
    const { error } = await this.client
      .from('order_pushes')
      .insert({
        order_id: orderId,
        cleaner_id: cleanerId,
        status: 'pending'
      });

    if (error) {
      throw new Error(`Failed to create push record: ${error.message}`);
    }
  }

  private async updatePushStatus(orderId: number, cleanerId: number, status: string) {
    const { error } = await this.client
      .from('order_pushes')
      .update({
        status,
        responded_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
      .eq('cleaner_id', cleanerId);

    if (error) {
      throw new Error(`Failed to update push status: ${error.message}`);
    }
  }

  async getOrderByCleaner(cleanerId: number) {
    const { data, error } = await this.client
      .from('cleaning_orders')
      .select(`
        *,
        order_pushes!inner (
          status,
          responded_at
        )
      `)
      .eq('matched_cleaner_id', cleanerId)
      .in('status', ['matched', 'accepted', 'in_progress'])
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch cleaner orders: ${error.message}`);
    }

    return data || [];
  }

  async getAllOrders(status?: string, page: number = 1, pageSize: number = 20) {
    let query = this.client
      .from('cleaning_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return data || [];
  }
}

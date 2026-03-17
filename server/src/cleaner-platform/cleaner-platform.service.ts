import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import {
  CreateCleanerApplicationDto,
  UpdateCleanerProfileDto,
  UpdateOnlineStatusDto,
  AcceptOrderDto,
  CreateReviewDto,
  QueryReviewsDto
} from './dto/cleaner-platform.dto';

@Injectable()
export class CleanerPlatformService {
  private readonly client = getSupabaseClient();

  // ============ 阿姨入驻相关 ============

  /**
   * 提交入驻申请
   */
  async submitApplication(dto: CreateCleanerApplicationDto, userId: string) {
    // 检查是否已申请
    const { data: existing } = await this.client
      .from('cleaners')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      throw new ConflictException('您已提交过入驻申请');
    }

    // 检查手机号是否已被使用
    const { data: phoneCheck } = await this.client
      .from('cleaners')
      .select('id')
      .eq('phone', dto.phone)
      .single();

    if (phoneCheck) {
      throw new ConflictException('该手机号已被注册');
    }

    const { data, error } = await this.client
      .from('cleaners')
      .insert({
        user_id: userId,
        name: dto.name,
        phone: dto.phone,
        avatar: dto.avatar,
        gender: dto.gender,
        age: dto.age,
        id_card: dto.idCard,
        service_types: dto.serviceTypes,
        experience_years: dto.experienceYears || 0,
        introduction: dto.introduction,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        is_online: false,
        is_verified: false,
        rating: 0.0,
        completed_orders: 0,
        total_earnings: 0,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`入驻申请提交失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 获取阿姨个人信息
   */
  async getProfile(userId: string) {
    const { data, error } = await this.client
      .from('cleaners')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('未找到阿姨信息，请先提交入驻申请');
    }

    return data;
  }

  /**
   * 更新阿姨个人信息
   */
  async updateProfile(userId: string, dto: UpdateCleanerProfileDto) {
    const updateData: any = { updated_at: new Date().toISOString() };

    if (dto.name) updateData.name = dto.name;
    if (dto.avatar) updateData.avatar = dto.avatar;
    if (dto.gender) updateData.gender = dto.gender;
    if (dto.age) updateData.age = dto.age;
    if (dto.serviceTypes) updateData.service_types = dto.serviceTypes;
    if (dto.experienceYears !== undefined) updateData.experience_years = dto.experienceYears;
    if (dto.introduction) updateData.introduction = dto.introduction;
    if (dto.address) updateData.address = dto.address;

    const { data, error } = await this.client
      .from('cleaners')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('更新失败，未找到阿姨信息');
    }

    return data;
  }

  /**
   * 更新在线状态
   */
  async updateOnlineStatus(userId: string, dto: UpdateOnlineStatusDto) {
    const { data, error } = await this.client
      .from('cleaners')
      .update({
        is_online: dto.isOnline,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('更新失败，未找到阿姨信息');
    }

    return data;
  }

  // ============ 订单相关 ============

  /**
   * 获取可接订单列表
   */
  async getAvailableOrders(userId: string, page: number = 1, pageSize: number = 20) {
    // 先获取阿姨信息和服务类型
    const { data: cleaner, error: cleanerError } = await this.client
      .from('cleaners')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (cleanerError || !cleaner) {
      throw new NotFoundException('未找到阿姨信息');
    }

    if (!cleaner.is_verified) {
      throw new BadRequestException('您还未通过审核，无法接单');
    }

    // 获取待匹配的订单
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.client
      .from('cleaning_orders')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')
      .is('cleaner_id', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`获取订单列表失败: ${error.message}`);
    }

    return {
      list: data || [],
      total: count || 0,
      page,
      pageSize
    };
  }

  /**
   * 接单
   */
  async acceptOrder(userId: string, orderId: string) {
    // 获取阿姨信息
    const { data: cleaner, error: cleanerError } = await this.client
      .from('cleaners')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (cleanerError || !cleaner) {
      throw new NotFoundException('未找到阿姨信息');
    }

    if (!cleaner.is_verified) {
      throw new BadRequestException('您还未通过审核，无法接单');
    }

    if (!cleaner.is_online) {
      throw new BadRequestException('请先上线后再接单');
    }

    // 检查订单是否存在且可接
    const { data: order, error: orderError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== 'pending' || order.cleaner_id) {
      throw new ConflictException('该订单已被其他阿姨接走');
    }

    // 更新订单状态
    const { data, error } = await this.client
      .from('cleaning_orders')
      .update({
        cleaner_id: cleaner.id,
        status: 'matched',
        matched_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw new Error(`接单失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 获取我的接单列表
   */
  async getMyOrders(userId: string, status?: string, page: number = 1, pageSize: number = 20) {
    // 获取阿姨信息
    const { data: cleaner, error: cleanerError } = await this.client
      .from('cleaners')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cleanerError || !cleaner) {
      throw new NotFoundException('未找到阿姨信息');
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.client
      .from('cleaning_orders')
      .select('*', { count: 'exact' })
      .eq('cleaner_id', cleaner.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(`获取订单列表失败: ${error.message}`);
    }

    return {
      list: data || [],
      total: count || 0,
      page,
      pageSize
    };
  }

  /**
   * 开始服务
   */
  async startService(userId: string, orderId: string) {
    const { data: cleaner } = await this.client
      .from('cleaners')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cleaner) {
      throw new NotFoundException('未找到阿姨信息');
    }

    const { data, error } = await this.client
      .from('cleaning_orders')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('cleaner_id', cleaner.id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('订单不存在或无权操作');
    }

    return data;
  }

  /**
   * 完成服务
   */
  async completeService(userId: string, orderId: string) {
    const { data: cleaner } = await this.client
      .from('cleaners')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cleaner) {
      throw new NotFoundException('未找到阿姨信息');
    }

    // 更新订单状态
    const { data: order, error: orderError } = await this.client
      .from('cleaning_orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('cleaner_id', cleaner.id)
      .select()
      .single();

    if (orderError || !order) {
      throw new NotFoundException('订单不存在或无权操作');
    }

    // 更新阿姨统计
    try {
      await this.client.rpc('increment_cleaner_stats', {
        cleaner_id: cleaner.id,
        order_price: order.price
      });
    } catch {
      // 如果 RPC 不存在，手动更新
      await this.client
        .from('cleaners')
        .update({
          completed_orders: cleaner.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', cleaner.id);
    }

    return order;
  }

  // ============ 评价相关 ============

  /**
   * 创建评价
   */
  async createReview(userId: string, dto: CreateReviewDto) {
    // 检查订单是否存在且已完成
    const { data: order, error: orderError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('id', dto.orderId)
      .single();

    if (orderError || !order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.user_id !== userId) {
      throw new BadRequestException('无权评价此订单');
    }

    if (order.status !== 'completed') {
      throw new BadRequestException('只能评价已完成的订单');
    }

    // 检查是否已评价
    const { data: existingReview } = await this.client
      .from('reviews')
      .select('id')
      .eq('order_id', dto.orderId)
      .single();

    if (existingReview) {
      throw new ConflictException('该订单已评价');
    }

    // 创建评价
    const { data, error } = await this.client
      .from('reviews')
      .insert({
        order_id: dto.orderId,
        user_id: userId,
        cleaner_id: order.cleaner_id,
        rating: dto.rating,
        comment: dto.comment,
        images: dto.images,
        service_attitude: dto.serviceAttitude || 5,
        service_quality: dto.serviceQuality || 5,
        punctuality: dto.punctuality || 5,
        is_anonymous: dto.isAnonymous || false
      })
      .select()
      .single();

    if (error) {
      throw new Error(`评价提交失败: ${error.message}`);
    }

    // 更新阿姨评分
    await this.updateCleanerRating(order.cleaner_id);

    return data;
  }

  /**
   * 获取阿姨的评价列表
   */
  async getCleanerReviews(cleanerId: number, page: number = 1, pageSize: number = 10) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.client
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('cleaner_id', cleanerId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`获取评价列表失败: ${error.message}`);
    }

    return {
      list: data || [],
      total: count || 0,
      page,
      pageSize
    };
  }

  /**
   * 获取订单的评价
   */
  async getOrderReview(orderId: string) {
    const { data, error } = await this.client
      .from('reviews')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * 更新阿姨评分
   */
  private async updateCleanerRating(cleanerId: number) {
    const { data: reviews } = await this.client
      .from('reviews')
      .select('rating')
      .eq('cleaner_id', cleanerId);

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await this.client
        .from('cleaners')
        .update({
          rating: Math.round(avgRating * 100) / 100,
          completed_orders: reviews.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', cleanerId);
    }
  }

  // ============ 统计相关 ============

  /**
   * 获取阿姨统计数据
   */
  async getStats(userId: string) {
    const { data: cleaner, error: cleanerError } = await this.client
      .from('cleaners')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (cleanerError || !cleaner) {
      throw new NotFoundException('未找到阿姨信息');
    }

    // 获取今日订单数
    const today = new Date().toISOString().split('T')[0];
    const { data: todayOrders } = await this.client
      .from('cleaning_orders')
      .select('id')
      .eq('cleaner_id', cleaner.id)
      .eq('status', 'completed')
      .gte('completed_at', today);

    // 获取本月收入
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const { data: monthOrders } = await this.client
      .from('cleaning_orders')
      .select('price')
      .eq('cleaner_id', cleaner.id)
      .eq('status', 'completed')
      .gte('completed_at', monthStart.toISOString());

    const monthEarnings = monthOrders?.reduce((sum, o) => sum + (o.price || 0), 0) || 0;

    return {
      totalOrders: cleaner.completed_orders,
      rating: cleaner.rating,
      totalEarnings: cleaner.total_earnings,
      todayOrders: todayOrders?.length || 0,
      monthEarnings,
      isOnline: cleaner.is_online,
      isVerified: cleaner.is_verified,
      status: cleaner.status
    };
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { 
  MembershipType, 
  MembershipStatus,
  PurchaseMembershipDto,
  MembershipPlanDto,
  CreateMembershipDto,
} from './dto/membership.dto';

@Injectable()
export class MembershipService {
  // 会员套餐配置
  private readonly plans: MembershipPlanDto[] = [
    {
      id: 'monthly',
      name: '按月会员',
      type: MembershipType.MONTHLY,
      price: 29.9,
      originalPrice: 39.9,
      duration: 1,
      durationUnit: '月',
      discount: 0.9,
      benefits: ['全场服务9折优惠', '专属客服通道', '优先预约权'],
    },
    {
      id: 'quarterly',
      name: '季度会员',
      type: MembershipType.QUARTERLY,
      price: 79.9,
      originalPrice: 119.7,
      duration: 3,
      durationUnit: '月',
      discount: 0.85,
      benefits: ['全场服务85折优惠', '专属客服通道', '优先预约权', '免费上门评估'],
      recommended: true,
    },
    {
      id: 'yearly',
      name: '年度会员',
      type: MembershipType.YEARLY,
      price: 299.9,
      originalPrice: 478.8,
      duration: 12,
      durationUnit: '月',
      discount: 0.8,
      benefits: ['全场服务8折优惠', '专属客服通道', '优先预约权', '免费上门评估', '生日专属礼品', '新服务免费体验'],
    },
  ];

  /**
   * 获取所有会员套餐
   */
  async getPlans(): Promise<MembershipPlanDto[]> {
    return this.plans;
  }

  /**
   * 获取用户当前会员信息
   */
  async getUserMembership(userId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('user_memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', MembershipStatus.ACTIVE)
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new BadRequestException('查询会员信息失败');
    }

    if (!data) {
      return null;
    }

    const plan = this.plans.find(p => p.type === data.type);
    
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date,
      discount: plan?.discount || 1,
      benefits: plan?.benefits || [],
      createdAt: data.created_at,
    };
  }

  /**
   * 购买会员
   */
  async purchaseMembership(userId: string, dto: PurchaseMembershipDto) {
    const plan = this.plans.find(p => p.type === dto.type);
    if (!plan) {
      throw new NotFoundException('套餐不存在');
    }

    const supabase = getSupabaseClient();
    
    // 计算开始和结束时间
    const startDate = new Date();
    const endDate = new Date();
    
    switch (dto.type) {
      case MembershipType.MONTHLY:
        endDate.setMonth(endDate.getMonth() + dto.duration);
        break;
      case MembershipType.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + dto.duration * 3);
        break;
      case MembershipType.YEARLY:
        endDate.setFullYear(endDate.getFullYear() + dto.duration);
        break;
    }

    // 计算总价
    const totalPrice = plan.price * dto.duration;

    // 创建会员记录
    const { data: membership, error } = await supabase
      .from('user_memberships')
      .insert({
        user_id: userId,
        type: dto.type,
        status: MembershipStatus.ACTIVE,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        price: totalPrice,
        payment_method: dto.paymentMethod || 'wechat',
        created_at: startDate.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('购买会员失败');
    }

    return {
      membershipId: membership.id,
      type: dto.type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
      discount: plan.discount,
      benefits: plan.benefits,
    };
  }

  /**
   * 获取会员权益说明
   */
  async getMembershipBenefits(type: MembershipType) {
    const plan = this.plans.find(p => p.type === type);
    if (!plan) {
      throw new NotFoundException('套餐不存在');
    }

    return {
      type: plan.type,
      name: plan.name,
      discount: plan.discount,
      benefits: plan.benefits,
      price: plan.price,
      originalPrice: plan.originalPrice,
    };
  }

  /**
   * 获取用户会员历史
   */
  async getMembershipHistory(userId: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('user_memberships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('查询会员历史失败');
    }

    return data || [];
  }
}

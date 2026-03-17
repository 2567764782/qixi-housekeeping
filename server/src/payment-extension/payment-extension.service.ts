import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class PaymentExtensionService {
  private readonly client = getSupabaseClient();

  /**
   * 获取用户余额
   */
  async getUserBalance(userId: string) {
    // 先尝试获取现有余额记录
    const { data: existingBalance, error: queryError } = await this.client
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 如果不存在，创建新的余额记录
    if (queryError || !existingBalance) {
      const { data: newBalance, error: createError } = await this.client
        .from('user_balances')
        .insert({
          user_id: userId,
          balance: 0,
          frozen_balance: 0,
          has_payment_password: false,
        })
        .select()
        .single();

      if (createError) {
        console.error('创建余额记录失败:', createError);
        return { balance: 0, frozenBalance: 0 };
      }

      return {
        balance: newBalance.balance,
        frozenBalance: newBalance.frozen_balance,
        hasPaymentPassword: false,
      };
    }

    return {
      balance: existingBalance.balance,
      frozenBalance: existingBalance.frozen_balance,
      hasPaymentPassword: existingBalance.has_payment_password,
    };
  }

  /**
   * 充值
   */
  async recharge(userId: string, amount: number, paymentMethod: string) {
    // 创建充值记录
    const rechargeId = `RCH${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    const { data: recharge, error: rechargeError } = await this.client
      .from('recharge_records')
      .insert({
        id: rechargeId,
        user_id: userId,
        amount,
        payment_method: paymentMethod,
        status: 'success', // 模拟充值成功
        transaction_id: `TXN${Date.now()}`,
      })
      .select()
      .single();

    if (rechargeError) {
      throw new Error(`创建充值记录失败: ${rechargeError.message}`);
    }

    // 更新用户余额
    const { data: currentBalance } = await this.client
      .from('user_balances')
      .select('balance')
      .eq('user_id', userId)
      .single();

    const newBalance = (currentBalance?.balance || 0) + amount;

    const { error: updateError } = await this.client
      .from('user_balances')
      .upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      throw new Error(`更新余额失败: ${updateError.message}`);
    }

    return {
      rechargeId: recharge.id,
      amount,
      newBalance,
    };
  }

  /**
   * 获取可用优惠券列表
   */
  async getAvailableCoupons() {
    const { data: coupons, error } = await this.client
      .from('coupons')
      .select('*');

    if (error) {
      console.error('获取优惠券失败:', error);
      return [];
    }

    // 过滤有效的优惠券
    const now = new Date();
    const availableCoupons = (coupons || []).filter(
      coupon => {
        const startTime = new Date(coupon.start_time);
        const endTime = new Date(coupon.end_time);
        return startTime <= now && endTime >= now && coupon.used_count < coupon.total_count;
      }
    );

    return availableCoupons;
  }

  /**
   * 获取用户优惠券
   */
  async getUserCoupons(userId: string) {
    const { data: userCoupons, error } = await this.client
      .from('user_coupons')
      .select(`
        *,
        coupon:coupons(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取用户优惠券失败:', error);
      return [];
    }

    // 更新过期状态
    const now = new Date();
    for (const uc of userCoupons || []) {
      if (uc.status === 'unused' && new Date(uc.coupon.end_time) < now) {
        await this.client
          .from('user_coupons')
          .update({ status: 'expired' })
          .eq('id', uc.id);
        uc.status = 'expired';
      }
    }

    return userCoupons || [];
  }

  /**
   * 领取优惠券
   */
  async claimCoupon(userId: string, couponId: string) {
    // 检查优惠券是否存在且可用
    const { data: coupon, error: couponError } = await this.client
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single();

    if (couponError || !coupon) {
      throw new Error('优惠券不存在');
    }

    if (coupon.used_count >= coupon.total_count) {
      throw new Error('优惠券已被领完');
    }

    // 检查是否已领取
    const { data: existingClaim } = await this.client
      .from('user_coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('coupon_id', couponId)
      .single();

    if (existingClaim) {
      throw new Error('您已领取过该优惠券');
    }

    // 创建用户优惠券记录
    const { data: userCoupon, error: claimError } = await this.client
      .from('user_coupons')
      .insert({
        user_id: userId,
        coupon_id: couponId,
        status: 'unused',
      })
      .select()
      .single();

    if (claimError) {
      throw new Error('领取失败');
    }

    // 更新优惠券已领取数量
    await this.client
      .from('coupons')
      .update({ used_count: coupon.used_count + 1 })
      .eq('id', couponId);

    return userCoupon;
  }

  /**
   * 设置支付密码
   */
  async setPaymentPassword(userId: string, password: string) {
    // 实际项目中应该对密码进行加密存储
    const hashedPassword = await this.hashPassword(password);

    const { error } = await this.client
      .from('user_balances')
      .upsert({
        user_id: userId,
        payment_password: hashedPassword,
        has_payment_password: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error('设置支付密码失败');
    }
  }

  /**
   * 验证支付密码
   */
  async verifyPaymentPassword(userId: string, password: string): Promise<boolean> {
    const { data: balance, error } = await this.client
      .from('user_balances')
      .select('payment_password, has_payment_password')
      .eq('user_id', userId)
      .single();

    if (error || !balance || !balance.has_payment_password) {
      return false;
    }

    // 实际项目中应该使用bcrypt等库进行密码比对
    return await this.comparePassword(password, balance.payment_password);
  }

  /**
   * 检查是否有支付密码
   */
  async hasPaymentPassword(userId: string): Promise<boolean> {
    const { data: balance } = await this.client
      .from('user_balances')
      .select('has_payment_password')
      .eq('user_id', userId)
      .single();

    return balance?.has_payment_password || false;
  }

  /**
   * 计算支付优惠
   */
  async calculateDiscount(
    userId: string,
    amount: number,
    couponId?: string,
    memberType?: string,
  ) {
    let discount = 0;
    let couponDiscount = 0;
    let memberDiscount = 0;

    // 会员折扣
    if (memberType) {
      const memberDiscounts: Record<string, number> = {
        monthly: 0.9,
        quarterly: 0.85,
        yearly: 0.8,
      };
      const discountRate = memberDiscounts[memberType] || 1;
      memberDiscount = amount * (1 - discountRate);
      amount -= memberDiscount;
    }

    // 优惠券折扣
    if (couponId) {
      const { data: userCoupon } = await this.client
        .from('user_coupons')
        .select('*, coupon:coupons(*)')
        .eq('user_id', userId)
        .eq('coupon_id', couponId)
        .eq('status', 'unused')
        .single();

      if (userCoupon && userCoupon.coupon) {
        const coupon = userCoupon.coupon as any;
        
        // 检查是否满足最低消费
        if (amount >= coupon.min_amount) {
          if (coupon.type === 'fixed') {
            couponDiscount = coupon.value;
          } else if (coupon.type === 'percent') {
            couponDiscount = amount * (1 - coupon.value);
          }
        }
      }
    }

    discount = memberDiscount + couponDiscount;
    const finalAmount = amount - couponDiscount;

    return {
      originalAmount: amount + memberDiscount + couponDiscount,
      memberDiscount,
      couponDiscount,
      discount,
      finalAmount: Math.max(0, finalAmount),
    };
  }

  /**
   * 创建分期付款
   */
  async createInstallment(userId: string, orderId: string, totalAmount: number, periods: number) {
    const installmentId = `INS${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    const periodAmount = Math.ceil(totalAmount / periods * 100) / 100;

    // 创建分期记录
    const { data: installment, error: installmentError } = await this.client
      .from('installments')
      .insert({
        id: installmentId,
        user_id: userId,
        order_id: orderId,
        total_amount: totalAmount,
        total_periods: periods,
        paid_periods: 0,
        period_amount: periodAmount,
        next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
      })
      .select()
      .single();

    if (installmentError) {
      throw new Error('创建分期失败');
    }

    // 创建分期详情
    const details: any[] = [];
    for (let i = 1; i <= periods; i++) {
      details.push({
        installment_id: installmentId,
        period_number: i,
        amount: periodAmount,
        due_date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
      });
    }

    await this.client.from('installment_details').insert(details);

    return {
      installmentId,
      totalAmount,
      periods,
      periodAmount,
    };
  }

  /**
   * 获取分期详情
   */
  async getInstallmentDetail(installmentId: string) {
    const { data: installment, error: installmentError } = await this.client
      .from('installments')
      .select('*')
      .eq('id', installmentId)
      .single();

    if (installmentError) {
      throw new Error('分期记录不存在');
    }

    const { data: details } = await this.client
      .from('installment_details')
      .select('*')
      .eq('installment_id', installmentId)
      .order('period_number', { ascending: true });

    return {
      ...installment,
      details,
    };
  }

  /**
   * 支付分期
   */
  async payInstallment(userId: string, installmentId: string, periodNumber: number) {
    // 获取分期详情
    const { data: detail, error: detailError } = await this.client
      .from('installment_details')
      .select('*, installments(*)')
      .eq('installment_id', installmentId)
      .eq('period_number', periodNumber)
      .single();

    if (detailError || !detail) {
      throw new Error('分期详情不存在');
    }

    if (detail.status === 'paid') {
      throw new Error('该期已支付');
    }

    // 更新分期详情状态
    await this.client
      .from('installment_details')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', detail.id);

    // 更新分期记录
    const installment = detail.installments as any;
    const newPaidPeriods = installment.paid_periods + 1;
    const nextPaymentDate = newPaidPeriods < installment.total_periods
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;

    await this.client
      .from('installments')
      .update({
        paid_periods: newPaidPeriods,
        next_payment_date: nextPaymentDate,
        status: newPaidPeriods >= installment.total_periods ? 'completed' : 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', installmentId);

    return {
      periodNumber,
      amount: detail.amount,
      paidAt: new Date().toISOString(),
    };
  }

  // 密码加密（简化实现，实际项目应使用bcrypt）
  private async hashPassword(password: string): Promise<string> {
    // 实际项目中应该使用 bcrypt.hash(password, 10)
    return `hashed_${password}`;
  }

  // 密码比对（简化实现）
  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    // 实际项目中应该使用 bcrypt.compare(password, hashedPassword)
    return `hashed_${password}` === hashedPassword;
  }
}

import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class StatisticsService {
  private readonly client = getSupabaseClient();

  /**
   * 获取订单统计概览
   */
  async getOrderStats(startDate?: string, endDate?: string) {
    let query = this.client
      .from('cleaning_orders')
      .select('*');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: orders, error } = await query;

    if (error) {
      throw new Error(`Failed to get order stats: ${error.message}`);
    }

    const allOrders = orders || [];

    // 按状态分组统计
    const statusStats = {
      pending_review: allOrders.filter(o => o.status === 'pending_review').length,
      verified: allOrders.filter(o => o.status === 'verified').length,
      matched: allOrders.filter(o => o.status === 'matched').length,
      accepted: allOrders.filter(o => o.status === 'accepted').length,
      in_progress: allOrders.filter(o => o.status === 'in_progress').length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    };

    // 按服务类型分组统计
    const serviceTypeStats = allOrders.reduce((acc, order) => {
      acc[order.service_type] = (acc[order.service_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 计算完成率
    const totalCompleted = statusStats.completed;
    const totalOrders = allOrders.length;
    const completionRate = totalOrders > 0 ? (totalCompleted / totalOrders * 100).toFixed(2) : '0.00';

    return {
      totalOrders,
      statusStats,
      serviceTypeStats,
      completionRate: parseFloat(completionRate),
      period: { startDate, endDate }
    };
  }

  /**
   * 获取保洁员绩效统计
   */
  async getCleanerStats(cleanerId: number, startDate?: string, endDate?: string) {
    // 获取保洁员基本信息
    const { data: cleaner, error: cleanerError } = await this.client
      .from('cleaners')
      .select('*')
      .eq('id', cleanerId)
      .single();

    if (cleanerError || !cleaner) {
      throw new Error('Cleaner not found');
    }

    // 获取订单统计
    let orderQuery = this.client
      .from('cleaning_orders')
      .select('*')
      .eq('matched_cleaner_id', cleanerId);

    if (startDate) {
      orderQuery = orderQuery.gte('created_at', startDate);
    }

    if (endDate) {
      orderQuery = orderQuery.lte('created_at', endDate);
    }

    const { data: orders, error: ordersError } = await orderQuery;

    if (ordersError) {
      throw new Error(`Failed to get orders: ${ordersError.message}`);
    }

    const allOrders = orders || [];

    // 计算各项指标
    const stats = {
      totalOrders: allOrders.length,
      completedOrders: allOrders.filter(o => o.status === 'completed').length,
      inProgressOrders: allOrders.filter(o => o.status === 'in_progress').length,
      cancelledOrders: allOrders.filter(o => o.status === 'cancelled').length,
      acceptanceRate: 0,
      completionRate: 0,
      avgResponseTime: 0, // 响应时间（从匹配到接单）
      avgServiceDuration: 0, // 服务时长
    };

    // 计算接单率（已接单 / 已匹配）
    const matchedOrders = allOrders.filter(o => o.status === 'matched' || o.status === 'accepted' || o.status === 'in_progress' || o.status === 'completed');
    if (matchedOrders.length > 0) {
      stats.acceptanceRate = parseFloat((
        (matchedOrders.filter(o => o.status !== 'matched').length / matchedOrders.length) * 100
      ).toFixed(2));
    }

    // 计算完成率（已完成 / 已接单）
    const acceptedOrders = allOrders.filter(o => o.status === 'accepted' || o.status === 'in_progress' || o.status === 'completed');
    if (acceptedOrders.length > 0) {
      stats.completionRate = parseFloat((
        (stats.completedOrders / acceptedOrders.length) * 100
      ).toFixed(2));
    }

    // 计算平均响应时间
    const responseTimes = allOrders
      .filter(o => o.matched_at && o.accepted_at)
      .map(o => {
        const matched = new Date(o.matched_at).getTime();
        const accepted = new Date(o.accepted_at).getTime();
        return (accepted - matched) / 1000 / 60; // 转换为分钟
      });

    if (responseTimes.length > 0) {
      stats.avgResponseTime = parseFloat(
        (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)
      );
    }

    return {
      cleaner,
      stats,
      orders: allOrders
    };
  }

  /**
   * 获取所有保洁员的绩效排名
   */
  async getCleanerRankings(startDate?: string, endDate?: string) {
    const { data: cleaners, error: cleanersError } = await this.client
      .from('cleaners')
      .select('id, name, rating, completed_orders')
      .eq('is_verified', true)
      .order('rating', { ascending: false });

    if (cleanersError) {
      throw new Error(`Failed to get cleaners: ${cleanersError.message}`);
    }

    const rankings: Array<{
      cleaner: any;
      stats: any;
      totalScore: number;
    }> = [];

    for (const cleaner of (cleaners || [])) {
      const stats = await this.getCleanerStats(cleaner.id, startDate, endDate);
      rankings.push({
        cleaner,
        stats: stats.stats,
        totalScore: this.calculateCleanerScore(stats.stats)
      });
    }

    // 按总分排序
    rankings.sort((a, b) => b.totalScore - a.totalScore);

    return rankings.map((item, index) => ({
      rank: index + 1,
      ...item
    }));
  }

  /**
   * 计算保洁员综合得分
   */
  private calculateCleanerScore(stats: any): number {
    const score =
      stats.completedOrders * 10 + // 完成订单数权重
      stats.acceptanceRate * 0.3 + // 接单率权重
      stats.completionRate * 0.3 + // 完成率权重
      (5 - stats.avgResponseTime / 60) * 5; // 响应时间权重（越快越好）

    return parseFloat(score.toFixed(2));
  }

  /**
   * 获取收入统计
   */
  async getRevenueStats(startDate?: string, endDate?: string) {
    // 这里假设订单表中有价格信息
    // 如果没有，需要从其他表中获取

    let query = this.client
      .from('cleaning_orders')
      .select('*')
      .eq('status', 'completed');

    if (startDate) {
      query = query.gte('completed_at', startDate);
    }

    if (endDate) {
      query = query.lte('completed_at', endDate);
    }

    const { data: orders, error } = await query;

    if (error) {
      throw new Error(`Failed to get revenue stats: ${error.message}`);
    }

    const completedOrders = orders || [];

    // 按日期分组统计收入
    const dailyRevenue = completedOrders.reduce((acc, order) => {
      const date = new Date(order.completed_at).toISOString().split('T')[0];
      // 假设每个订单有 price 字段，如果没有则使用默认值
      const price = (order as any).price || 100;
      acc[date] = (acc[date] || 0) + price;
      return acc;
    }, {} as Record<string, number>);

    // 按保洁员分组统计收入
    const cleanerRevenue = completedOrders.reduce((acc, order) => {
      const cleanerId = order.matched_cleaner_id;
      const price = (order as any).price || 100;
      acc[cleanerId] = (acc[cleanerId] || 0) + price;
      return acc;
    }, {} as Record<number, number>);

    const totalRevenue = Object.values(dailyRevenue).reduce((acc: number, curr: number) => acc + curr, 0);

    return {
      totalRevenue,
      dailyRevenue,
      cleanerRevenue,
      totalOrders: completedOrders.length,
      avgOrderValue: completedOrders.length > 0 ? (totalRevenue as number) / completedOrders.length : 0
    };
  }

  /**
   * 获取仪表板数据
   */
  async getDashboardData() {
    // 获取最近7天的日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // 并行获取各项统计
    const [orderStats, cleanerRankings, revenueStats] = await Promise.all([
      this.getOrderStats(startDateStr, endDateStr),
      this.getCleanerRankings(startDateStr, endDateStr),
      this.getRevenueStats(startDateStr, endDateStr)
    ]);

    return {
      orderStats,
      cleanerRankings: cleanerRankings.slice(0, 10), // 取前10名
      revenueStats,
      period: {
        startDate: startDateStr,
        endDate: endDateStr,
        days: 7
      }
    };
  }
}

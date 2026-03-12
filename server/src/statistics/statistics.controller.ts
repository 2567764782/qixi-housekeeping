import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Roles } from '../roles/roles.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * 获取订单统计
   */
  @Get('orders')
  @Roles('admin')
  async getOrderStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const stats = await this.statisticsService.getOrderStats(startDate, endDate);
    return {
      status: 'success',
      data: stats
    };
  }

  /**
   * 获取保洁员绩效统计
   */
  @Get('cleaners/:cleanerId')
  @Roles('admin', 'cleaner')
  async getCleanerStats(
    @Query('cleanerId') cleanerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const stats = await this.statisticsService.getCleanerStats(
      parseInt(cleanerId),
      startDate,
      endDate
    );
    return {
      status: 'success',
      data: stats
    };
  }

  /**
   * 获取保洁员绩效排名
   */
  @Get('cleaners/rankings')
  @Roles('admin')
  async getCleanerRankings(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const rankings = await this.statisticsService.getCleanerRankings(startDate, endDate);
    return {
      status: 'success',
      data: rankings
    };
  }

  /**
   * 获取收入统计
   */
  @Get('revenue')
  @Roles('admin')
  async getRevenueStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const stats = await this.statisticsService.getRevenueStats(startDate, endDate);
    return {
      status: 'success',
      data: stats
    };
  }

  /**
   * 获取仪表板数据
   */
  @Get('dashboard')
  @Roles('admin')
  async getDashboardData() {
    const data = await this.statisticsService.getDashboardData();
    return {
      status: 'success',
      data
    };
  }
}

import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { PurchaseMembershipDto, MembershipType } from './dto/membership.dto';
import { Public } from '../decorators/public.decorator';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  /**
   * 获取所有会员套餐（公开接口）
   */
  @Public()
  @Get('plans')
  async getPlans() {
    const plans = await this.membershipService.getPlans();
    return {
      code: 200,
      msg: 'success',
      data: plans,
    };
  }

  /**
   * 获取用户当前会员信息
   */
  @Get('current')
  async getCurrentMembership(@Request() req: any) {
    const membership = await this.membershipService.getUserMembership(req.user.userId);
    return {
      code: 200,
      msg: 'success',
      data: membership,
    };
  }

  /**
   * 购买会员
   */
  @Post('purchase')
  async purchaseMembership(
    @Request() req: any,
    @Body() dto: PurchaseMembershipDto,
  ) {
    const result = await this.membershipService.purchaseMembership(req.user.userId, dto);
    return {
      code: 200,
      msg: '购买成功',
      data: result,
    };
  }

  /**
   * 获取会员权益说明（公开接口）
   */
  @Public()
  @Get('benefits/:type')
  async getBenefits(type: MembershipType) {
    const benefits = await this.membershipService.getMembershipBenefits(type);
    return {
      code: 200,
      msg: 'success',
      data: benefits,
    };
  }

  /**
   * 获取用户会员历史
   */
  @Get('history')
  async getMembershipHistory(@Request() req: any) {
    const history = await this.membershipService.getMembershipHistory(req.user.userId);
    return {
      code: 200,
      msg: 'success',
      data: history,
    };
  }

  /**
   * 获取按月会员套餐
   */
  @Public()
  @Get('monthly')
  async getMonthlyPlan() {
    const plans = await this.membershipService.getPlans();
    const monthlyPlan = plans.find(p => p.type === MembershipType.MONTHLY);
    return {
      code: 200,
      msg: 'success',
      data: monthlyPlan,
    };
  }

  /**
   * 获取季度会员套餐
   */
  @Public()
  @Get('quarterly')
  async getQuarterlyPlan() {
    const plans = await this.membershipService.getPlans();
    const quarterlyPlan = plans.find(p => p.type === MembershipType.QUARTERLY);
    return {
      code: 200,
      msg: 'success',
      data: quarterlyPlan,
    };
  }

  /**
   * 获取年度会员套餐
   */
  @Public()
  @Get('yearly')
  async getYearlyPlan() {
    const plans = await this.membershipService.getPlans();
    const yearlyPlan = plans.find(p => p.type === MembershipType.YEARLY);
    return {
      code: 200,
      msg: 'success',
      data: yearlyPlan,
    };
  }
}

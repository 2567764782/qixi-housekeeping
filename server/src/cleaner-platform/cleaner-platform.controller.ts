import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { CleanerPlatformService } from './cleaner-platform.service';
import {
  CreateCleanerApplicationDto,
  UpdateCleanerProfileDto,
  UpdateOnlineStatusDto,
  AcceptOrderDto,
  CreateReviewDto,
  QueryReviewsDto
} from './dto/cleaner-platform.dto';
import { Public } from '../decorators/public.decorator';

@Controller('cleaner-platform')
export class CleanerPlatformController {
  constructor(private readonly service: CleanerPlatformService) {}

  // ============ 阿姨入驻 ============

  /**
   * 提交入驻申请
   * POST /api/cleaner-platform/apply
   */
  @Post('apply')
  async submitApplication(@Body() dto: CreateCleanerApplicationDto) {
    try {
      // 模拟用户ID（实际应从JWT获取）
      const userId = 'mock-user-id';
      const data = await this.service.submitApplication(dto, userId);
      return { code: 200, msg: '入驻申请已提交，请等待审核', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取阿姨个人信息
   * GET /api/cleaner-platform/profile
   */
  @Public()
  @Get('profile')
  async getProfile(@Query('userId') userId: string) {
    try {
      const uid = userId || 'mock-user-id';
      const data = await this.service.getProfile(uid);
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 404, msg: error.message, data: null },
        HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * 更新阿姨个人信息
   * PUT /api/cleaner-platform/profile
   */
  @Put('profile')
  async updateProfile(@Body() dto: UpdateCleanerProfileDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.service.updateProfile(userId, dto);
      return { code: 200, msg: '信息更新成功', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 更新在线状态
   * PUT /api/cleaner-platform/online-status
   */
  @Put('online-status')
  async updateOnlineStatus(@Body() dto: UpdateOnlineStatusDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.service.updateOnlineStatus(userId, dto);
      return { code: 200, msg: dto.isOnline ? '已上线' : '已下线', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取统计数据
   * GET /api/cleaner-platform/stats
   */
  @Public()
  @Get('stats')
  async getStats(@Query('userId') userId: string) {
    try {
      const uid = userId || 'mock-user-id';
      const data = await this.service.getStats(uid);
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ============ 订单相关 ============

  /**
   * 获取可接订单列表
   * GET /api/cleaner-platform/available-orders
   */
  @Public()
  @Get('available-orders')
  async getAvailableOrders(
    @Query('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20'
  ) {
    try {
      const uid = userId || 'mock-user-id';
      const data = await this.service.getAvailableOrders(
        uid,
        parseInt(page, 10) || 1,
        parseInt(pageSize, 10) || 20
      );
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 接单
   * POST /api/cleaner-platform/accept-order
   */
  @Post('accept-order')
  async acceptOrder(@Body() dto: AcceptOrderDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.service.acceptOrder(userId, dto.orderId);
      return { code: 200, msg: '接单成功', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取我的订单列表
   * GET /api/cleaner-platform/my-orders
   */
  @Public()
  @Get('my-orders')
  async getMyOrders(
    @Query('userId') userId: string,
    @Query('status') status?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20'
  ) {
    try {
      const uid = userId || 'mock-user-id';
      const data = await this.service.getMyOrders(
        uid,
        status,
        parseInt(page, 10) || 1,
        parseInt(pageSize, 10) || 20
      );
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 开始服务
   * PUT /api/cleaner-platform/orders/:orderId/start
   */
  @Put('orders/:orderId/start')
  async startService(@Param('orderId') orderId: string) {
    try {
      const userId = 'mock-user-id';
      const data = await this.service.startService(userId, orderId);
      return { code: 200, msg: '已开始服务', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 完成服务
   * PUT /api/cleaner-platform/orders/:orderId/complete
   */
  @Put('orders/:orderId/complete')
  async completeService(@Param('orderId') orderId: string) {
    try {
      const userId = 'mock-user-id';
      const data = await this.service.completeService(userId, orderId);
      return { code: 200, msg: '服务已完成', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ============ 评价相关 ============

  /**
   * 创建评价
   * POST /api/cleaner-platform/reviews
   */
  @Post('reviews')
  async createReview(@Body() dto: CreateReviewDto) {
    try {
      const userId = 'mock-user-id';
      const data = await this.service.createReview(userId, dto);
      return { code: 200, msg: '评价提交成功', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取阿姨的评价列表
   * GET /api/cleaner-platform/reviews/cleaner/:cleanerId
   */
  @Public()
  @Get('reviews/cleaner/:cleanerId')
  async getCleanerReviews(
    @Param('cleanerId') cleanerId: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    try {
      const data = await this.service.getCleanerReviews(
        parseInt(cleanerId, 10),
        parseInt(page, 10) || 1,
        parseInt(pageSize, 10) || 10
      );
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 获取订单的评价
   * GET /api/cleaner-platform/reviews/order/:orderId
   */
  @Public()
  @Get('reviews/order/:orderId')
  async getOrderReview(@Param('orderId') orderId: string) {
    try {
      const data = await this.service.getOrderReview(orderId);
      return { code: 200, msg: 'success', data };
    } catch (error) {
      throw new HttpException(
        { code: 500, msg: error.message, data: null },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

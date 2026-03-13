import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  SendNotificationDto,
  CreateSubscriptionDto,
  QueryNotificationsDto
} from './dto/notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    try {
      const result = await this.notificationsService.sendNotification(sendNotificationDto);
      return result;
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '发送通知失败，请稍后重试' : (error.message || '发送通知失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('subscribe')
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.notificationsService.createSubscription(createSubscriptionDto);
      return {
        code: 200,
        msg: '订阅创建成功',
        data: subscription
      };
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '创建订阅失败，请稍后重试' : (error.message || '创建订阅失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('subscriptions')
  async getUserSubscriptions(@Query('userId') userId: string) {
    try {
      if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '用户ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const subscriptions = await this.notificationsService.getUserSubscriptions(userId.trim());
      return {
        code: 200,
        msg: 'success',
        data: subscriptions
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取用户订阅失败，请稍后重试' : (error.message || '获取用户订阅失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') id: string) {
    try {
      // 验证 ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订阅ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const idNum = parseInt(id.trim(), 10)
      if (Number.isNaN(idNum) || idNum < 1 || idNum > 2147483647) {
        throw new HttpException(
          { code: 400, message: '订阅ID格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      await this.notificationsService.cancelSubscription(idNum);
      return {
        code: 200,
        msg: '订阅取消成功',
        data: null
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '取消订阅失败，请稍后重试' : (error.message || '取消订阅失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('push-records')
  async getPushRecords(
    @Query('orderId') orderId?: string,
    @Query('cleanerId') cleanerId?: string
  ) {
    try {
      let orderIdNum: number | undefined
      let cleanerIdNum: number | undefined

      if (orderId !== undefined) {
        orderIdNum = parseInt(orderId, 10)
        if (Number.isNaN(orderIdNum) || orderIdNum < 1 || orderIdNum > 2147483647) {
          throw new HttpException(
            { code: 400, message: '订单ID格式不正确', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      if (cleanerId !== undefined) {
        cleanerIdNum = parseInt(cleanerId, 10)
        if (Number.isNaN(cleanerIdNum) || cleanerIdNum < 1 || cleanerIdNum > 2147483647) {
          throw new HttpException(
            { code: 400, message: '保洁员ID格式不正确', data: null },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      const records = await this.notificationsService.getPushRecords(orderIdNum, cleanerIdNum);
      return {
        code: 200,
        msg: 'success',
        data: records
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取推送记录失败，请稍后重试' : (error.message || '获取推送记录失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('order/:id/match-notification')
  async sendOrderMatchedNotification(
    @Param('id') id: string,
    @Body() body: { cleanerId: number }
  ) {
    try {
      // 验证订单ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const orderIdNum = parseInt(id.trim(), 10)
      if (Number.isNaN(orderIdNum) || orderIdNum < 1 || orderIdNum > 2147483647) {
        throw new HttpException(
          { code: 400, message: '订单ID格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证保洁员ID
      if (!body.cleanerId || typeof body.cleanerId !== 'number') {
        throw new HttpException(
          { code: 400, message: '保洁员ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      if (body.cleanerId < 1 || body.cleanerId > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const result = await this.notificationsService.sendOrderMatchedNotification(
        orderIdNum,
        body.cleanerId
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '发送订单匹配通知失败，请稍后重试' : (error.message || '发送订单匹配通知失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('order/:id/status-notification')
  async sendOrderStatusNotification(
    @Param('id') id: string,
    @Body() body: { userId: number; status: string }
  ) {
    try {
      // 验证订单ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const orderIdNum = parseInt(id.trim(), 10)
      if (Number.isNaN(orderIdNum) || orderIdNum < 1 || orderIdNum > 2147483647) {
        throw new HttpException(
          { code: 400, message: '订单ID格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证用户ID
      if (!body.userId || typeof body.userId !== 'number') {
        throw new HttpException(
          { code: 400, message: '用户ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      if (body.userId < 1 || body.userId > 2147483647) {
        throw new HttpException(
          { code: 400, message: '用户ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证状态
      if (!body.status || typeof body.status !== 'string' || body.status.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '订单状态不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
      if (!validStatuses.includes(body.status)) {
        throw new HttpException(
          { code: 400, message: '无效的订单状态', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const result = await this.notificationsService.sendOrderStatusNotification(
        orderIdNum,
        body.userId,
        body.status
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '发送订单状态通知失败，请稍后重试' : (error.message || '发送订单状态通知失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}

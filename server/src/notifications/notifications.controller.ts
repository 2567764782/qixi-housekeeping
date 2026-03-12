import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe
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
    const result = await this.notificationsService.sendNotification(sendNotificationDto);
    return result;
  }

  @Post('subscribe')
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.notificationsService.createSubscription(createSubscriptionDto);
    return {
      status: 'success',
      data: subscription
    };
  }

  @Get('subscriptions')
  async getUserSubscriptions(@Query('userId') userId: string) {
    const subscriptions = await this.notificationsService.getUserSubscriptions(userId);
    return {
      status: 'success',
      data: subscriptions
    };
  }

  @Post('subscriptions/:id/cancel')
  async cancelSubscription(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.cancelSubscription(id);
    return {
      status: 'success',
      message: 'Subscription cancelled successfully'
    };
  }

  @Get('push-records')
  async getPushRecords(
    @Query('orderId') orderId?: number,
    @Query('cleanerId') cleanerId?: number
  ) {
    const records = await this.notificationsService.getPushRecords(orderId, cleanerId);
    return {
      status: 'success',
      data: records
    };
  }

  @Post('order/:id/match-notification')
  async sendOrderMatchedNotification(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() body: { cleanerId: number }
  ) {
    const result = await this.notificationsService.sendOrderMatchedNotification(
      orderId,
      body.cleanerId
    );
    return result;
  }

  @Post('order/:id/status-notification')
  async sendOrderStatusNotification(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() body: { userId: number; status: string }
  ) {
    const result = await this.notificationsService.sendOrderStatusNotification(
      orderId,
      body.userId,
      body.status
    );
    return result;
  }
}

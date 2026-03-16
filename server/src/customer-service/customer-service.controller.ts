import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';

@Controller('customer-service')
export class CustomerServiceController {
  constructor(private readonly customerServiceService: CustomerServiceService) {}

  /**
   * 获取聊天历史记录
   */
  @Get('messages')
  async getMessages(@Query('limit') limit?: string) {
    const messageLimit = limit ? parseInt(limit, 10) : 50;
    const messages = await this.customerServiceService.getMessages(messageLimit);
    return {
      code: 200,
      message: '获取成功',
      data: messages,
    };
  }

  /**
   * 发送消息
   */
  @Post('messages')
  async sendMessage(
    @Body() body: { content: string; type: string; userId?: string }
  ) {
    const message = await this.customerServiceService.sendMessage(
      body.content,
      body.type,
      body.userId
    );
    return {
      code: 200,
      message: '发送成功',
      data: message,
    };
  }

  /**
   * 获取未读消息数量
   */
  @Get('unread-count')
  async getUnreadCount(@Query('userId') userId: string) {
    const count = await this.customerServiceService.getUnreadCount(userId);
    return {
      code: 200,
      message: '获取成功',
      data: { count },
    };
  }

  /**
   * 标记消息已读
   */
  @Post('mark-read')
  async markAsRead(@Body() body: { userId: string; messageIds?: string[] }) {
    await this.customerServiceService.markAsRead(body.userId, body.messageIds);
    return {
      code: 200,
      message: '标记成功',
      data: null,
    };
  }
}

import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CleaningOrdersService } from './cleaning-orders.service';
import { CreateOrderDto, VerifyOrderDto, MatchOrderDto, AcceptOrderDto } from './dto/cleaning-orders.dto';

@Controller('cleaning-orders')
export class CleaningOrdersController {
  constructor(private readonly cleaningOrdersService: CleaningOrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.cleaningOrdersService.createOrder(createOrderDto);
    return {
      status: 'success',
      data: order
    };
  }

  @Get('pending-review')
  async getPendingReviewOrders() {
    const orders = await this.cleaningOrdersService.getPendingReviewOrders();
    return {
      status: 'success',
      data: orders
    };
  }

  @Post(':id/verify')
  async verifyOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyDto: VerifyOrderDto,
    @Query('adminId') adminId: number
  ) {
    const order = await this.cleaningOrdersService.verifyOrder(id, verifyDto, adminId);
    return {
      status: 'success',
      data: order
    };
  }

  @Get(':id/match-cleaners')
  async getMatchedCleaners(@Param('id', ParseIntPipe) id: number) {
    const cleaners = await this.cleaningOrdersService.getMatchedCleaners(id);
    return {
      status: 'success',
      data: cleaners
    };
  }

  @Post(':id/match')
  async matchCleaner(
    @Param('id', ParseIntPipe) id: number,
    @Body() matchDto: MatchOrderDto
  ) {
    const order = await this.cleaningOrdersService.matchCleaner(id, matchDto);
    return {
      status: 'success',
      data: order
    };
  }

  @Post(':id/accept')
  async acceptOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() acceptDto: AcceptOrderDto
  ) {
    const order = await this.cleaningOrdersService.acceptOrder(id, acceptDto.cleanerId);
    return {
      status: 'success',
      data: order
    };
  }

  @Get('cleaner/:cleanerId')
  async getOrderByCleaner(@Param('cleanerId', ParseIntPipe) cleanerId: number) {
    const orders = await this.cleaningOrdersService.getOrderByCleaner(cleanerId);
    return {
      status: 'success',
      data: orders
    };
  }

  @Get()
  async getAllOrders(
    @Query('status') status?: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 20
  ) {
    const orders = await this.cleaningOrdersService.getAllOrders(status, page, pageSize);
    return {
      status: 'success',
      data: orders
    };
  }
}

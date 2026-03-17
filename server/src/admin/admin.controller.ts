import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from '../decorators/public.decorator';

@Controller('admin')
@Public()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('test')
  async test() {
    return { code: 200, msg: 'test success' };
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async testPost(@Body() body: any) {
    console.log('testPost body:', body);
    return { code: 200, msg: 'test post success', data: body };
  }

  // ==================== 优惠券管理接口 ====================
  
  @Get('coupons')
  async getCoupons() {
    const data = await this.adminService.getCoupons();
    return { code: 200, msg: 'success', data };
  }

  @Get('coupons/:id')
  async getCoupon(@Param('id') id: string) {
    const data = await this.adminService.getCouponById(id);
    return { code: 200, msg: 'success', data };
  }

  @Post('coupons')
  @HttpCode(HttpStatus.OK)
  async createCoupon(@Body() body: any) {
    const data = await this.adminService.createCoupon(body);
    return { code: 200, msg: '创建成功', data };
  }

  @Put('coupons/:id')
  @HttpCode(HttpStatus.OK)
  async updateCoupon(@Param('id') id: string, @Body() body: any) {
    const data = await this.adminService.updateCoupon(id, body);
    return { code: 200, msg: '更新成功', data };
  }

  @Delete('coupons/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCoupon(@Param('id') id: string) {
    await this.adminService.deleteCoupon(id);
    return { code: 200, msg: '删除成功' };
  }

  // ==================== 会员管理接口 ====================
  
  @Get('members')
  async getMembers() {
    const data = await this.adminService.getMembers();
    return { code: 200, msg: 'success', data };
  }

  @Get('members/:id')
  async getMember(@Param('id') id: string) {
    const data = await this.adminService.getMemberById(id);
    return { code: 200, msg: 'success', data };
  }

  @Put('members/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateMemberStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const data = await this.adminService.updateMemberStatus(id, body.status);
    return { code: 200, msg: '状态更新成功', data };
  }

  // ==================== 轮播图管理接口 ====================
  
  @Get('banners')
  async getBanners() {
    const data = await this.adminService.getBanners();
    return { code: 200, msg: 'success', data };
  }

  @Post('banners')
  @HttpCode(HttpStatus.OK)
  async createBanner(@Body() body: any) {
    const data = await this.adminService.createBanner(body);
    return { code: 200, msg: '创建成功', data };
  }

  @Put('banners/:id')
  @HttpCode(HttpStatus.OK)
  async updateBanner(@Param('id') id: string, @Body() body: any) {
    const data = await this.adminService.updateBanner(id, body);
    return { code: 200, msg: '更新成功', data };
  }

  @Put('banners/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateBannerStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const data = await this.adminService.updateBannerStatus(id, body.status);
    return { code: 200, msg: '状态更新成功', data };
  }

  @Delete('banners/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBanner(@Param('id') id: string) {
    await this.adminService.deleteBanner(id);
    return { code: 200, msg: '删除成功' };
  }

  // ==================== 公告管理接口 ====================
  
  @Get('announcements')
  async getAnnouncements() {
    const data = await this.adminService.getAnnouncements();
    return { code: 200, msg: 'success', data };
  }

  @Post('announcements')
  @HttpCode(HttpStatus.OK)
  async createAnnouncement(@Body() body: any) {
    const data = await this.adminService.createAnnouncement(body);
    return { code: 200, msg: '创建成功', data };
  }

  @Put('announcements/:id')
  @HttpCode(HttpStatus.OK)
  async updateAnnouncement(@Param('id') id: string, @Body() body: any) {
    const data = await this.adminService.updateAnnouncement(id, body);
    return { code: 200, msg: '更新成功', data };
  }

  @Put('announcements/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateAnnouncementStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const data = await this.adminService.updateAnnouncementStatus(id, body.status);
    return { code: 200, msg: '状态更新成功', data };
  }

  @Delete('announcements/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAnnouncement(@Param('id') id: string) {
    await this.adminService.deleteAnnouncement(id);
    return { code: 200, msg: '删除成功' };
  }

  // ==================== 服务内容管理接口 ====================
  
  @Get('service-contents')
  async getServiceContents() {
    const data = await this.adminService.getServiceContents();
    return { code: 200, msg: 'success', data };
  }

  @Post('service-contents')
  @HttpCode(HttpStatus.OK)
  async createServiceContent(@Body() body: any) {
    const data = await this.adminService.createServiceContent(body);
    return { code: 200, msg: '创建成功', data };
  }

  @Put('service-contents/:id')
  @HttpCode(HttpStatus.OK)
  async updateServiceContent(@Param('id') id: string, @Body() body: any) {
    const data = await this.adminService.updateServiceContent(id, body);
    return { code: 200, msg: '更新成功', data };
  }

  @Put('service-contents/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateServiceContentStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const data = await this.adminService.updateServiceContentStatus(id, body.status);
    return { code: 200, msg: '状态更新成功', data };
  }

  @Delete('service-contents/:id')
  @HttpCode(HttpStatus.OK)
  async deleteServiceContent(@Param('id') id: string) {
    await this.adminService.deleteServiceContent(id);
    return { code: 200, msg: '删除成功' };
  }
}

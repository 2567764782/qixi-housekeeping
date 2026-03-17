import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';
import { Public } from '../decorators/public.decorator';
import { HeaderUtils } from 'coze-coding-dev-sdk';

@Controller('news')
@Public()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * 获取热点新闻列表
   * GET /api/news/hot
   */
  @Get('hot')
  async getHotNews(
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const data = await this.newsService.getHotNews(
      category,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0
    );
    return { code: 200, msg: 'success', data };
  }

  /**
   * 搜索新闻
   * POST /api/news/search
   */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async searchNews(
    @Body() body: { query: string; count?: number },
    @Headers() headers: Record<string, string>
  ) {
    const customHeaders = HeaderUtils.extractForwardHeaders(headers);
    const data = await this.newsService.searchNews(
      body.query,
      body.count || 10,
      customHeaders
    );
    
    return {
      code: 200,
      msg: 'success',
      data: {
        summary: data.summary,
        items: data.web_items?.map(item => ({
          id: item.id,
          title: item.title,
          summary: item.summary || item.snippet,
          source: item.site_name,
          url: item.url,
          publishTime: item.publish_time
        })) || []
      }
    };
  }

  /**
   * 抓取并保存新闻
   * POST /api/news/fetch
   */
  @Post('fetch')
  @HttpCode(HttpStatus.OK)
  async fetchNews(
    @Body() body: { query: string; category?: string; count?: number },
    @Headers() headers: Record<string, string>
  ) {
    const customHeaders = HeaderUtils.extractForwardHeaders(headers);
    const data = await this.newsService.fetchAndSaveNews(
      body.query,
      body.category || 'general',
      body.count || 10,
      customHeaders
    );
    return { code: 200, msg: '抓取完成', data };
  }

  /**
   * 自动抓取热点新闻（管理后台调用）
   * POST /api/news/auto-fetch
   */
  @Post('auto-fetch')
  @HttpCode(HttpStatus.OK)
  async autoFetchNews(@Headers() headers: Record<string, string>) {
    const customHeaders = HeaderUtils.extractForwardHeaders(headers);
    const data = await this.newsService.autoFetchHotNews(customHeaders);
    return { code: 200, msg: '自动抓取完成', data };
  }

  /**
   * 获取新闻详情
   * GET /api/news/:id
   */
  @Get(':id')
  async getNewsById(@Param('id') id: string) {
    const data = await this.newsService.getNewsById(id);
    return { code: 200, msg: 'success', data };
  }

  /**
   * 创建新闻
   * POST /api/news
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createNews(@Body() body: any) {
    const data = await this.newsService.createNews(body);
    return { code: 200, msg: '创建成功', data };
  }

  /**
   * 更新新闻
   * PUT /api/news/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateNews(@Param('id') id: string, @Body() body: any) {
    const data = await this.newsService.updateNews(id, body);
    return { code: 200, msg: '更新成功', data };
  }

  /**
   * 删除新闻
   * DELETE /api/news/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNews(@Param('id') id: string) {
    await this.newsService.deleteNews(id);
    return { code: 200, msg: '删除成功' };
  }

  /**
   * 获取新闻分类
   * GET /api/news/categories
   */
  @Get('categories/list')
  async getCategories() {
    const data = await this.newsService.getCategories();
    return { code: 200, msg: 'success', data };
  }
}

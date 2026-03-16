import { Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { NewsService } from './news.service'
import { NewsCronService } from './news-cron.service'
import { FetchToutiaoNewsDto } from './dto/news.dto'

@ApiTags('新闻')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly newsCronService: NewsCronService
  ) {}

  @Get('toutiao')
  @ApiOperation({ summary: '获取头条号新闻' })
  @ApiQuery({ name: 'category', required: false, description: '新闻分类（finance/entertainment/family）' })
  @ApiQuery({ name: 'keyword', required: false, description: '关键词搜索' })
  async getToutiaoNews(@Query() query: FetchToutiaoNewsDto) {
    console.log('📰 收到获取头条新闻请求:', query)

    const news = await this.newsService.getToutiaoNews(query.category, query.keyword)

    return {
      code: 200,
      msg: '获取成功',
      data: news
    }
  }

  @Post('fetch')
  @ApiOperation({ summary: '手动触发新闻抓取' })
  async manualFetch() {
    console.log('🔧 收到手动触发新闻抓取请求')

    const result = await this.newsCronService.manualFetch()

    return {
      code: 200,
      msg: result.message,
      data: {
        count: result.count
      }
    }
  }
}

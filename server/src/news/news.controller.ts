import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { NewsService } from './news.service'
import { FetchToutiaoNewsDto } from './dto/news.dto'

@ApiTags('新闻')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('toutiao')
  @ApiOperation({ summary: '获取头条号新闻' })
  @ApiQuery({ name: 'category', required: false, description: '新闻分类' })
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
}

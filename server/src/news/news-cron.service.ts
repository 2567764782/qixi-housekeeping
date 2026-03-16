import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { NewsService } from './news.service'

interface NewsItem {
  title: string
  url: string
  source?: string
  publish_time?: string
  description?: string
  category?: string
}

@Injectable()
export class NewsCronService {
  private readonly logger = new Logger(NewsCronService.name)

  constructor(
    private configService: ConfigService,
    private newsService: NewsService
  ) {}

  /**
   * 每天早上 7:00 抓取新闻
   */
  @Cron('0 7 * * *', {
    name: 'dailyMorningNews',
    timeZone: 'Asia/Shanghai'
  })
  async handleDailyMorningNews() {
    this.logger.log('🌅 开始执行每天早上 7:00 新闻抓取任务...')
    await this.fetchAllCategories()
    this.logger.log('✅ 每天早上新闻抓取任务完成')
  }

  /**
   * 每 30 分钟抓取一次新闻
   */
  @Cron(CronExpression.EVERY_30_MINUTES, {
    name: 'periodicNewsFetch',
    timeZone: 'Asia/Shanghai'
  })
  async handlePeriodicNewsFetch() {
    this.logger.log('⏰ 开始执行每 30 分钟新闻抓取任务...')
    await this.fetchAllCategories()
    this.logger.log('✅ 每 30 分钟新闻抓取任务完成')
  }

  /**
   * 抓取所有分类的新闻
   */
  private async fetchAllCategories() {
    const categories = ['finance', 'entertainment', 'family']

    for (const category of categories) {
      try {
        await this.fetchNewsByCategory(category)
        // 每个分类之间间隔 5 秒，避免请求过于频繁
        await this.delay(5000)
      } catch (error) {
        this.logger.error(`❌ 抓取 ${category} 分类新闻失败:`, error)
      }
    }
  }

  /**
   * 根据分类抓取新闻
   */
  private async fetchNewsByCategory(category: string): Promise<void> {
    this.logger.log(`📰 开始抓取 ${category} 分类新闻...`)

    try {
      // 模拟抓取新闻数据
      // 在实际应用中，你可以：
      // 1. 使用 FetchClient 抓取真实新闻源
      // 2. 调用新闻 API
      // 3. 使用 RSS 订阅

      const newsItems = await this.generateMockNews(category)

      // 保存到数据库
      await this.newsService.saveNews(newsItems, category)

      this.logger.log(`✅ 成功抓取并保存 ${newsItems.length} 条 ${category} 新闻`)
    } catch (error) {
      this.logger.error(`❌ 抓取 ${category} 新闻失败:`, error)
      throw error
    }
  }

  /**
   * 生成模拟新闻数据
   * 在实际应用中，这里应该调用真实的新闻源
   */
  private async generateMockNews(category: string): Promise<NewsItem[]> {
    const categoryNames: Record<string, string> = {
      finance: '财经',
      entertainment: '娱乐',
      family: '家庭'
    }

    const now = new Date()

    // 每个分类生成 5 条模拟新闻
    const mockNews: NewsItem[] = [
      {
        title: `${categoryNames[category]}新闻：最新市场动态分析`,
        url: `https://example.com/news/${category}/1`,
        source: '头条号',
        publish_time: now.toISOString(),
        description: `这是一条关于${categoryNames[category]}领域的最新报道...`,
        category
      },
      {
        title: `${categoryNames[category]}热点：行业发展趋势解读`,
        url: `https://example.com/news/${category}/2`,
        source: '头条号',
        publish_time: new Date(now.getTime() - 3600000).toISOString(),
        description: `深入分析${categoryNames[category]}行业的未来发展方向...`,
        category
      },
      {
        title: `${categoryNames[category]}资讯：专家观点与建议`,
        url: `https://example.com/news/${category}/3`,
        source: '头条号',
        publish_time: new Date(now.getTime() - 7200000).toISOString(),
        description: `多位专家对${categoryNames[category]}领域发表了看法...`,
        category
      },
      {
        title: `${categoryNames[category]}焦点：政策影响与市场反应`,
        url: `https://example.com/news/${category}/4`,
        source: '头条号',
        publish_time: new Date(now.getTime() - 10800000).toISOString(),
        description: `最新政策对${categoryNames[category]}市场的影响分析...`,
        category
      },
      {
        title: `${categoryNames[category]}观察：消费者行为变化`,
        url: `https://example.com/news/${category}/5`,
        source: '头条号',
        publish_time: new Date(now.getTime() - 14400000).toISOString(),
        description: `${categoryNames[category]}领域消费者行为的新趋势...`,
        category
      }
    ]

    return mockNews
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 手动触发抓取（用于测试）
   */
  async manualFetch(): Promise<{ message: string; count: number }> {
    this.logger.log('🔧 手动触发新闻抓取...')
    await this.fetchAllCategories()
    return {
      message: '手动抓取完成',
      count: 15 // 3个分类 x 5条新闻
    }
  }
}

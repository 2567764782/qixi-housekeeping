import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NewsRepository } from './news.repository'

export interface NewsItem {
  id?: string
  title: string
  url: string
  source?: string
  publish_time?: string
  description?: string
  category?: string
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name)

  constructor(
    private configService: ConfigService,
    private newsRepository: NewsRepository
  ) {}

  /**
   * 获取头条号新闻
   */
  async getToutiaoNews(category?: string, keyword?: string): Promise<NewsItem[]> {
    try {
      this.logger.log('📰 开始获取头条号新闻...')

      // 从数据库获取新闻（限制前3条）
      let news = await this.newsRepository.getNews(3, category)

      // 如果有关键词，进行过滤
      if (keyword) {
        news = news.filter(item =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.description?.toLowerCase().includes(keyword.toLowerCase())
        )
      }

      this.logger.log(`✅ 成功获取 ${news.length} 条新闻`)

      return news
    } catch (error) {
      this.logger.error('❌ 获取新闻失败:', error)
      throw error
    }
  }

  /**
   * 保存新闻到数据库
   */
  async saveNews(newsItems: NewsItem[], category: string): Promise<void> {
    await this.newsRepository.saveNews(newsItems, category)
  }

  /**
   * 格式化时间
   */
  private formatPublishTime(isoString: string): string {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }
}

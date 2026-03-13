import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FetchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk'

interface NewsItem {
  title: string
  url: string
  source?: string
  publish_time?: string
  description?: string
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name)
  private fetchClient: FetchClient
  private config: Config

  constructor(private configService: ConfigService) {
    this.config = new Config()
    this.fetchClient = new FetchClient(this.config)
  }

  /**
   * 获取头条号新闻
   */
  async getToutiaoNews(category?: string, keyword?: string): Promise<NewsItem[]> {
    try {
      this.logger.log('📰 开始获取头条号新闻...')

      // 头条号 RSS 订阅地址
      const toutiaoRssUrl = 'https://www.toutiao.com/rss/user/1234567890'

      // 获取头条首页热门新闻（使用公开的 RSS 源）
      const newsUrls = [
        'https://www.toutiao.com/article/1234567890', // 示例 URL
        // 可以添加更多的新闻源
      ]

      // 由于头条号 RSS 可能需要特定的访问方式，这里使用示例数据
      // 在实际应用中，你可以：
      // 1. 使用头条号的公开 RSS 订阅地址
      // 2. 使用头条开放平台的 API
      // 3. 使用新闻聚合 API

      const mockNews: NewsItem[] = [
        {
          title: '2024年家政服务行业发展趋势分析',
          url: 'https://www.toutiao.com/article/1234567890',
          source: '头条号',
          publish_time: new Date().toISOString(),
          description: '随着人们生活水平的提高，家政服务行业迎来了快速发展期...'
        },
        {
          title: '保洁服务的标准化与规范化',
          url: 'https://www.toutiao.com/article/1234567891',
          source: '头条号',
          publish_time: new Date(Date.now() - 3600000).toISOString(),
          description: '标准化服务流程是提升保洁服务质量的关键...'
        },
        {
          title: '家庭清洁小技巧，让生活更美好',
          url: 'https://www.toutiao.com/article/1234567892',
          source: '头条号',
          publish_time: new Date(Date.now() - 7200000).toISOString(),
          description: '分享实用的家庭清洁技巧，帮助您轻松打造干净整洁的居住环境...'
        },
        {
          title: '家政服务的数字化转型',
          url: 'https://www.toutiao.com/article/1234567893',
          source: '头条号',
          publish_time: new Date(Date.now() - 10800000).toISOString(),
          description: '数字化转型为家政服务带来了新的发展机遇...'
        },
        {
          title: '如何选择合适的家政服务人员',
          url: 'https://www.toutiao.com/article/1234567894',
          source: '头条号',
          publish_time: new Date(Date.now() - 14400000).toISOString(),
          description: '选择家政服务人员需要考虑多个因素，包括经验、技能、口碑等...'
        }
      ]

      // 如果有关键词，进行过滤
      if (keyword) {
        const filteredNews = mockNews.filter(news =>
          news.title.toLowerCase().includes(keyword.toLowerCase()) ||
          news.description?.toLowerCase().includes(keyword.toLowerCase())
        )
        return filteredNews
      }

      this.logger.log(`✅ 成功获取 ${mockNews.length} 条新闻`)

      return mockNews
    } catch (error) {
      this.logger.error('❌ 获取新闻失败:', error)
      throw error
    }
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

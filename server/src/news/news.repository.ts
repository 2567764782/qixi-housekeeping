import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NewsItem } from './news.service'

@Injectable()
export class NewsRepository {
  private readonly logger = new Logger(NewsRepository.name)
  private supabase: SupabaseClient

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY') ||
                        this.configService.get<string>('SUPABASE_ANON_KEY')

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey)
      this.logger.log('✅ Supabase 客户端初始化成功')
    } else {
      this.logger.warn('⚠️  Supabase 配置缺失，将使用内存存储')
    }
  }

  /**
   * 保存新闻到数据库
   */
  async saveNews(newsItems: NewsItem[], category: string): Promise<void> {
    try {
      if (!this.supabase) {
        this.logger.warn('⚠️  Supabase 未配置，跳过保存')
        return
      }

      // 准备数据
      const dataToInsert = newsItems.map(item => ({
        title: item.title,
        url: item.url,
        source: item.source || '头条号',
        publish_time: item.publish_time || new Date().toISOString(),
        description: item.description,
        category: category,
        created_at: new Date().toISOString()
      }))

      // 插入数据
      const { error } = await this.supabase
        .from('news')
        .insert(dataToInsert)

      if (error) {
        // 如果表不存在，创建表
        if (error.code === '42P01') {
          await this.createNewsTable()
          // 重新插入
          const { error: retryError } = await this.supabase
            .from('news')
            .insert(dataToInsert)
          
          if (retryError) {
            throw retryError
          }
        } else {
          throw error
        }
      }

      this.logger.log(`✅ 成功保存 ${dataToInsert.length} 条新闻到数据库`)
    } catch (error) {
      this.logger.error('❌ 保存新闻失败:', error)
      throw error
    }
  }

  /**
   * 获取新闻列表
   */
  async getNews(limit: number = 3, category?: string): Promise<NewsItem[]> {
    try {
      if (!this.supabase) {
        this.logger.warn('⚠️  Supabase 未配置，返回模拟数据')
        return this.getMockNews(limit, category)
      }

      let query = this.supabase
        .from('news')
        .select('*')
        .order('publish_time', { ascending: false })
        .limit(limit)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        // 如果表不存在，返回模拟数据
        if (error.code === '42P01') {
          this.logger.warn('⚠️  新闻表不存在，返回模拟数据')
          return this.getMockNews(limit, category)
        }
        throw error
      }

      return data || []
    } catch (error) {
      this.logger.error('❌ 获取新闻失败:', error)
      return this.getMockNews(limit, category)
    }
  }

  /**
   * 创建新闻表
   */
  private async createNewsTable(): Promise<void> {
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS news (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          source TEXT DEFAULT '头条号',
          publish_time TIMESTAMPTZ DEFAULT NOW(),
          description TEXT,
          category TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
        CREATE INDEX IF NOT EXISTS idx_news_publish_time ON news(publish_time DESC);
      `

      const { error } = await this.supabase.rpc('exec_sql', { sql: createTableSQL })

      if (error) {
        this.logger.error('❌ 创建新闻表失败:', error)
      } else {
        this.logger.log('✅ 新闻表创建成功')
      }
    } catch (error) {
      this.logger.error('❌ 创建新闻表失败:', error)
    }
  }

  /**
   * 获取模拟新闻数据
   */
  private getMockNews(limit: number = 3, category?: string): NewsItem[] {
    const now = new Date()
    const categoryNames: Record<string, string> = {
      finance: '财经',
      entertainment: '娱乐',
      family: '家庭'
    }

    const allNews: NewsItem[] = [
      {
        id: '1',
        title: `${categoryNames[category || 'finance']}新闻：最新市场动态分析`,
        url: `https://example.com/news/${category || 'finance'}/1`,
        source: '头条号',
        publish_time: now.toISOString(),
        description: `这是一条关于${categoryNames[category || 'finance']}领域的最新报道...`,
        category: category || 'finance'
      },
      {
        id: '2',
        title: `${categoryNames[category || 'finance']}热点：行业发展趋势解读`,
        url: `https://example.com/news/${category || 'finance'}/2`,
        source: '头条号',
        publish_time: new Date(now.getTime() - 3600000).toISOString(),
        description: `深入分析${categoryNames[category || 'finance']}行业的未来发展方向...`,
        category: category || 'finance'
      },
      {
        id: '3',
        title: `${categoryNames[category || 'finance']}资讯：专家观点与建议`,
        url: `https://example.com/news/${category || 'finance'}/3`,
        source: '头条号',
        publish_time: new Date(now.getTime() - 7200000).toISOString(),
        description: `多位专家对${categoryNames[category || 'finance']}领域发表了看法...`,
        category: category || 'finance'
      }
    ]

    return allNews.slice(0, limit)
  }

  /**
   * 清理过期新闻（保留最近7天）
   */
  async cleanOldNews(): Promise<void> {
    try {
      if (!this.supabase) {
        return
      }

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { error } = await this.supabase
        .from('news')
        .delete()
        .lt('publish_time', sevenDaysAgo.toISOString())

      if (error) {
        throw error
      }

      this.logger.log('✅ 清理过期新闻完成')
    } catch (error) {
      this.logger.error('❌ 清理过期新闻失败:', error)
    }
  }
}

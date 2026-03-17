import { Injectable } from '@nestjs/common';
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class NewsService {
  private get client() {
    return getSupabaseClient();
  }

  /**
   * 从网络搜索新闻
   */
  async searchNews(query: string, count: number = 10, headers?: Record<string, string>) {
    const config = new Config();
    const customHeaders = headers || {};
    const searchClient = new SearchClient(config, customHeaders);

    // 使用高级搜索，限制时间范围为最近一周
    const response = await searchClient.advancedSearch(query, {
      searchType: 'web',
      count: count,
      needSummary: true,
      needUrl: true,
      timeRange: '1w', // 最近一周
    });

    return response;
  }

  /**
   * 获取热点新闻列表
   */
  async getHotNews(category?: string, limit: number = 20, offset: number = 0) {
    let query = this.client
      .from('hot_news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取热点新闻失败:', error);
      throw error;
    }

    return data;
  }

  /**
   * 搜索并保存新闻到数据库
   */
  async fetchAndSaveNews(query: string, category: string = 'general', count: number = 10, headers?: Record<string, string>) {
    // 搜索新闻
    const searchResult = await this.searchNews(query, count, headers);
    
    const savedNews: any[] = [];
    
    if (searchResult.web_items && searchResult.web_items.length > 0) {
      for (const item of searchResult.web_items) {
        // 检查是否已存在相同URL的新闻
        const { data: existing } = await this.client
          .from('hot_news')
          .select('id')
          .eq('source_url', item.url)
          .single();

        if (existing) {
          continue; // 跳过已存在的新闻
        }

        // 生成唯一ID
        const newsId = `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 保存新闻
        const { data, error } = await this.client
          .from('hot_news')
          .insert([{
            id: newsId,
            title: item.title,
            summary: item.summary || item.snippet,
            content: item.content,
            source: item.site_name,
            source_url: item.url,
            category: category,
            publish_time: item.publish_time || new Date().toISOString(),
            is_hot: true,
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (!error && data) {
          savedNews.push(data);
        }
      }
    }

    return {
      total: searchResult.web_items?.length || 0,
      saved: savedNews.length,
      news: savedNews,
      summary: searchResult.summary
    };
  }

  /**
   * 获取新闻详情
   */
  async getNewsById(id: string) {
    const { data, error } = await this.client
      .from('hot_news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取新闻详情失败:', error);
      throw error;
    }

    // 增加浏览次数
    await this.client
      .from('hot_news')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return data;
  }

  /**
   * 创建新闻
   */
  async createNews(newsData: any) {
    const newsId = newsData.id || `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await this.client
      .from('hot_news')
      .insert([{
        id: newsId,
        ...newsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('创建新闻失败:', error);
      throw error;
    }

    return data;
  }

  /**
   * 更新新闻
   */
  async updateNews(id: string, newsData: any) {
    const { data, error } = await this.client
      .from('hot_news')
      .update({
        ...newsData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新新闻失败:', error);
      throw error;
    }

    return data;
  }

  /**
   * 删除新闻
   */
  async deleteNews(id: string) {
    const { error } = await this.client
      .from('hot_news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除新闻失败:', error);
      throw error;
    }

    return { success: true };
  }

  /**
   * 获取新闻分类列表
   */
  async getCategories() {
    const categories = [
      { key: 'industry', name: '行业资讯', icon: 'Briefcase' },
      { key: 'market', name: '市场动态', icon: 'TrendingUp' },
      { key: 'tech', name: '技术前沿', icon: 'Cpu' },
      { key: 'policy', name: '政策法规', icon: 'FileText' },
      { key: 'tips', name: '生活小贴士', icon: 'Lightbulb' },
      { key: 'general', name: '综合新闻', icon: 'Newspaper' }
    ];
    return categories;
  }

  /**
   * 自动抓取热点新闻（定时任务用）
   */
  async autoFetchHotNews(headers?: Record<string, string>) {
    const queries = [
      { query: '家政服务行业 新闻', category: 'industry' },
      { query: '保洁服务 市场动态', category: 'market' },
      { query: '智能家居 清洁技术', category: 'tech' },
      { query: '家政服务 政策法规', category: 'policy' }
    ];

    const results: any[] = [];
    
    for (const { query, category } of queries) {
      try {
        const result = await this.fetchAndSaveNews(query, category, 5, headers);
        results.push({
          query,
          category,
          ...result
        });
      } catch (error) {
        console.error(`抓取新闻失败 [${query}]:`, error);
      }
    }

    return results;
  }
}

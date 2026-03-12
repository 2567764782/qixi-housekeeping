import { Injectable } from '@nestjs/common';
import { SearchClient, Config } from 'coze-coding-dev-sdk';

@Injectable()
export class SearchService {
  private client: SearchClient;

  constructor() {
    const config = new Config();
    this.client = new SearchClient(config);
  }

  async searchCleaningPlatforms() {
    try {
      const response = await this.client.webSearch(
        '国内保洁员招聘平台 保洁阿姨 找保洁工人',
        10,
        true
      );

      return {
        status: 'success',
        summary: response.summary || '',
        platforms: response.web_items?.map(item => ({
          title: item.title,
          url: item.url,
          siteName: item.site_name,
          snippet: item.snippet
        })) || []
      };
    } catch (error) {
      console.error('搜索保洁平台失败:', error);
      return {
        status: 'error',
        message: '搜索保洁平台失败',
        platforms: []
      };
    }
  }

  async searchRenovationPlatforms() {
    try {
      const response = await this.client.webSearch(
        '国内装修需求发布平台 找装修 装修接单',
        10,
        true
      );

      return {
        status: 'success',
        summary: response.summary || '',
        platforms: response.web_items?.map(item => ({
          title: item.title,
          url: item.url,
          siteName: item.site_name,
          snippet: item.snippet
        })) || []
      };
    } catch (error) {
      console.error('搜索装修平台失败:', error);
      return {
        status: 'error',
        message: '搜索装修平台失败',
        platforms: []
      };
    }
  }
}

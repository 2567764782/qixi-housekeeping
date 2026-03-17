import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { RefreshCw, Flame, Clock, Eye, ChevronRight, Briefcase, TrendingUp, Cpu, FileText, Lightbulb, Newspaper } from 'lucide-react-taro'
import './index.css'

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  source_url: string
  category: string
  is_hot: boolean
  view_count: number
  publish_time: string
  created_at: string
}

interface Category {
  key: string
  name: string
  icon: string
}

const HotNewsPage = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const pageSize = 10

  useLoad(() => {
    loadCategories()
    loadNews()
  })

  useReachBottom(() => {
    if (hasMore && !loading) {
      loadMore()
    }
  })

  const loadCategories = async () => {
    try {
      const res = await Network.request({
        url: '/api/news/categories/list',
        method: 'GET'
      })
      if (res.statusCode === 200 && res.data?.data) {
        setCategories(res.data.data)
      }
    } catch (error) {
      console.error('加载分类失败:', error)
      setCategories([
        { key: '', name: '全部', icon: 'Newspaper' },
        { key: 'industry', name: '行业资讯', icon: 'Briefcase' },
        { key: 'market', name: '市场动态', icon: 'TrendingUp' },
        { key: 'tech', name: '技术前沿', icon: 'Cpu' },
        { key: 'policy', name: '政策法规', icon: 'FileText' },
        { key: 'tips', name: '生活小贴士', icon: 'Lightbulb' }
      ])
    }
  }

  const loadNews = async (isRefresh = false) => {
    if (loading) return
    
    if (isRefresh) {
      setRefreshing(true)
      setPage(0)
    } else {
      setLoading(true)
    }

    try {
      const res = await Network.request({
        url: '/api/news/hot',
        method: 'GET',
        data: {
          category: activeCategory || undefined,
          limit: pageSize,
          offset: isRefresh ? 0 : page * pageSize
        }
      })

      if (res.statusCode === 200 && res.data?.data) {
        const newNews = res.data.data
        if (isRefresh) {
          setNewsList(newNews)
          setPage(1)
        } else {
          setNewsList(prev => [...prev, ...newNews])
          setPage(prev => prev + 1)
        }
        setHasMore(newNews.length === pageSize)
      }
    } catch (error) {
      console.error('加载新闻失败:', error)
      // 使用模拟数据
      const mockNews: NewsItem[] = [
        {
          id: 'news-001',
          title: '2024年家政服务行业发展趋势报告发布',
          summary: '报告显示，家政服务行业正朝着智能化、标准化方向发展，预计市场规模将突破万亿。',
          source: '行业资讯',
          source_url: 'https://example.com/news/1',
          category: 'industry',
          is_hot: true,
          view_count: 1234,
          publish_time: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'news-002',
          title: '春节家政服务需求激增，提前预约成趋势',
          summary: '随着春节临近，保洁、家政等服务需求大幅增长，建议市民提前预约。',
          source: '市场动态',
          source_url: 'https://example.com/news/2',
          category: 'market',
          is_hot: true,
          view_count: 2345,
          publish_time: new Date(Date.now() - 7200000).toISOString(),
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'news-003',
          title: '智能清洁设备助力家政服务升级',
          summary: '新型智能清洁设备的应用，有效提升了家政服务效率和质量。',
          source: '技术前沿',
          source_url: 'https://example.com/news/3',
          category: 'tech',
          is_hot: false,
          view_count: 567,
          publish_time: new Date(Date.now() - 10800000).toISOString(),
          created_at: new Date(Date.now() - 10800000).toISOString()
        }
      ]
      setNewsList(mockNews)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const loadMore = () => {
    if (!hasMore || loading) return
    loadNews()
  }

  const handleRefresh = () => {
    loadNews(true)
  }

  const handleCategoryChange = (categoryKey: string) => {
    setActiveCategory(categoryKey)
    setPage(0)
    setNewsList([])
    setTimeout(() => loadNews(true), 100)
  }

  const handleNewsClick = (news: NewsItem) => {
    Taro.navigateTo({
      url: `/pages/news-detail/index?id=${news.id}`
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString()
  }

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Briefcase,
      TrendingUp,
      Cpu,
      FileText,
      Lightbulb,
      Newspaper
    }
    return iconMap[iconName] || Newspaper
  }

  return (
    <View className="page-container">
      {/* 头部 */}
      <View className="page-header">
        <Text className="page-title">热点新闻</Text>
        <View className="header-action" onClick={handleRefresh}>
          <RefreshCw size={22} color="#F85659" className={refreshing ? 'rotating' : ''} />
        </View>
      </View>

      {/* 分类标签 */}
      <ScrollView scrollX className="category-scroll">
        <View className="category-list">
          {categories.map(cat => {
            const IconComponent = getCategoryIcon(cat.icon)
            return (
              <View
                key={cat.key}
                className={`category-item ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.key)}
              >
                <IconComponent size={14} color={activeCategory === cat.key ? '#F85659' : '#666'} />
                <Text className="category-text">{cat.name}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* 新闻列表 */}
      <ScrollView scrollY className="news-list" onScrollToLower={loadMore}>
        {newsList.map(news => (
          <View 
            key={news.id} 
            className="news-card"
            onClick={() => handleNewsClick(news)}
          >
            <View className="news-header">
              {news.is_hot && (
                <View className="hot-tag">
                  <Flame size={12} color="#F85659" />
                  <Text className="hot-text">热门</Text>
                </View>
              )}
              <Text className="news-title">{news.title}</Text>
            </View>
            
            <Text className="news-summary">{news.summary}</Text>
            
            <View className="news-footer">
              <View className="news-meta">
                <Text className="news-source">{news.source}</Text>
                <View className="meta-divider" />
                <View className="meta-item">
                  <Clock size={12} color="#999" />
                  <Text className="meta-text">{formatTime(news.publish_time || news.created_at)}</Text>
                </View>
                <View className="meta-item">
                  <Eye size={12} color="#999" />
                  <Text className="meta-text">{news.view_count || 0}</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#ccc" />
            </View>
          </View>
        ))}

        {loading && (
          <View className="loading-state">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}

        {!hasMore && newsList.length > 0 && (
          <View className="no-more-state">
            <Text className="no-more-text">没有更多了</Text>
          </View>
        )}

        {newsList.length === 0 && !loading && (
          <View className="empty-state">
            <Newspaper size={48} color="#ddd" />
            <Text className="empty-text">暂无新闻</Text>
            <View className="refresh-btn" onClick={handleRefresh}>
              <RefreshCw size={16} color="#F85659" />
              <Text className="refresh-text">刷新试试</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default HotNewsPage

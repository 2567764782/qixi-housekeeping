import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { RefreshCw, Search, Trash2, ArrowLeft, Flame, Eye, Clock } from 'lucide-react-taro'
import './index.css'

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  source_url: string
  category: string
  is_hot: boolean
  is_published: boolean
  view_count: number
  publish_time: string
  created_at: string
}

const NewsManagePage = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [fetchQuery, setFetchQuery] = useState('家政服务 新闻')

  useLoad(() => {
    loadNews()
  })

  const loadNews = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/news/hot',
        method: 'GET',
        data: { limit: 50 }
      })

      if (res.statusCode === 200 && res.data?.data) {
        setNewsList(res.data.data)
      }
    } catch (error) {
      console.error('加载新闻失败:', error)
      // 模拟数据
      setNewsList([
        {
          id: 'news-001',
          title: '2024年家政服务行业发展趋势报告发布',
          summary: '报告显示，家政服务行业正朝着智能化、标准化方向发展',
          source: '行业资讯',
          source_url: 'https://example.com/news/1',
          category: 'industry',
          is_hot: true,
          is_published: true,
          view_count: 1234,
          publish_time: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFetchNews = async () => {
    if (!fetchQuery.trim()) {
      Taro.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }

    setFetching(true)
    try {
      const res = await Network.request({
        url: '/api/news/fetch',
        method: 'POST',
        data: {
          query: fetchQuery,
          category: 'general',
          count: 10
        }
      })

      if (res.statusCode === 200) {
        Taro.showToast({ 
          title: `抓取完成，新增${res.data?.data?.saved || 0}条`, 
          icon: 'success' 
        })
        loadNews()
      }
    } catch (error) {
      Taro.showToast({ title: '抓取失败', icon: 'none' })
    } finally {
      setFetching(false)
    }
  }

  const handleAutoFetch = async () => {
    setFetching(true)
    try {
      const res = await Network.request({
        url: '/api/news/auto-fetch',
        method: 'POST'
      })

      if (res.statusCode === 200) {
        const results = res.data?.data || []
        const totalSaved = results.reduce((sum: number, r: any) => sum + (r.saved || 0), 0)
        Taro.showToast({ 
          title: `自动抓取完成，新增${totalSaved}条`, 
          icon: 'success' 
        })
        loadNews()
      }
    } catch (error) {
      Taro.showToast({ title: '自动抓取失败', icon: 'none' })
    } finally {
      setFetching(false)
    }
  }

  const handleDelete = async (newsId: string) => {
    const confirm = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条新闻吗？'
    })

    if (confirm.confirm) {
      try {
        const res = await Network.request({
          url: `/api/news/${newsId}`,
          method: 'DELETE'
        })

        if (res.statusCode === 200) {
          Taro.showToast({ title: '删除成功', icon: 'success' })
          loadNews()
        }
      } catch (error) {
        Taro.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  }

  const handleToggleHot = async (newsId: string, isHot: boolean) => {
    try {
      const res = await Network.request({
        url: `/api/news/${newsId}`,
        method: 'PUT',
        data: { is_hot: !isHot }
      })

      if (res.statusCode === 200) {
        Taro.showToast({ title: isHot ? '已取消热门' : '已设为热门', icon: 'success' })
        loadNews()
      }
    } catch (error) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const filteredNews = newsList.filter(n => 
    n.title.includes(searchKeyword) || n.summary?.includes(searchKeyword)
  )

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5)
  }

  return (
    <View className="page-container">
      {/* 头部 */}
      <View className="page-header">
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="page-title">新闻管理</Text>
        <View className="header-action" onClick={loadNews}>
          <RefreshCw size={24} color="#F85659" className={loading ? 'rotating' : ''} />
        </View>
      </View>

      {/* 抓取区域 */}
      <View className="fetch-section">
        <Text className="section-title">新闻抓取</Text>
        <View className="fetch-input-row">
          <View className="fetch-input-wrap">
            <Input
              className="fetch-input"
              placeholder="输入搜索关键词"
              value={fetchQuery}
              onInput={e => setFetchQuery(e.detail.value)}
            />
          </View>
          <View 
            className={`fetch-btn ${fetching ? 'disabled' : ''}`}
            onClick={fetching ? undefined : handleFetchNews}
          >
            <Search size={16} color="#fff" />
            <Text className="fetch-btn-text">抓取</Text>
          </View>
        </View>
        <View className="auto-fetch-btn" onClick={fetching ? undefined : handleAutoFetch}>
          <RefreshCw size={16} color="#F85659" className={fetching ? 'rotating' : ''} />
          <Text className="auto-fetch-text">一键自动抓取热点</Text>
        </View>
      </View>

      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Search size={18} color="#999" />
          <Input
            className="search-input"
            placeholder="搜索新闻标题/内容"
            value={searchKeyword}
            onInput={e => setSearchKeyword(e.detail.value)}
          />
        </View>
        <Text className="news-count">共 {filteredNews.length} 条</Text>
      </View>

      {/* 新闻列表 */}
      <ScrollView scrollY className="news-list">
        {filteredNews.map(news => (
          <View key={news.id} className="news-card">
            <View className="news-header">
              <View className="news-title-row">
                {news.is_hot && (
                  <View className="hot-badge">
                    <Flame size={12} color="#fff" />
                  </View>
                )}
                <Text className="news-title">{news.title}</Text>
              </View>
              <View className={`status-badge ${news.is_published ? 'published' : 'draft'}`}>
                <Text className="status-text">{news.is_published ? '已发布' : '草稿'}</Text>
              </View>
            </View>

            <Text className="news-summary">{news.summary}</Text>

            <View className="news-meta">
              <Text className="news-source">{news.source}</Text>
              <View className="meta-item">
                <Clock size={12} color="#999" />
                <Text className="meta-text">{formatTime(news.created_at)}</Text>
              </View>
              <View className="meta-item">
                <Eye size={12} color="#999" />
                <Text className="meta-text">{news.view_count || 0}</Text>
              </View>
            </View>

            <View className="news-actions">
              <View 
                className={`action-btn ${news.is_hot ? 'active' : ''}`}
                onClick={() => handleToggleHot(news.id, news.is_hot)}
              >
                <Flame size={14} color={news.is_hot ? '#F85659' : '#999'} />
                <Text className={`action-text ${news.is_hot ? 'active' : ''}`}>
                  {news.is_hot ? '取消热门' : '设为热门'}
                </Text>
              </View>
              <View className="action-btn danger" onClick={() => handleDelete(news.id)}>
                <Trash2 size={14} color="#EF4444" />
                <Text className="action-text danger">删除</Text>
              </View>
            </View>
          </View>
        ))}

        {filteredNews.length === 0 && !loading && (
          <View className="empty-state">
            <Text className="empty-text">暂无新闻数据</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default NewsManagePage

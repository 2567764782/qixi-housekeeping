import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Clock, ExternalLink, RefreshCw, Newspaper } from 'lucide-react-taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface NewsItem {
  title: string
  url: string
  source?: string
  publish_time?: string
  description?: string
}

const NewsPage = () => {
  useLoad(() => {
    loadNews()
  })

  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // 加载新闻列表
  const loadNews = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/news/toutiao',
        method: 'GET'
      })
      console.log('📰 新闻数据:', res.data)
      setNewsList(res.data || [])
    } catch (error) {
      console.error('Failed to load news:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 刷新新闻
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadNews()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  // 打开新闻链接
  const openNews = (url: string) => {
    Taro.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(url)}`
    })
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 顶部标题栏 */}
      <View className="bg-white px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between">
        <Text className="block text-xl font-bold text-gray-800">实时新闻</Text>
        <View
          className={`flex flex-row items-center ${refreshing ? 'animate-spin' : ''}`}
          onClick={handleRefresh}
        >
          <RefreshCw size={20} color="#10B981" />
        </View>
      </View>

      <ScrollView className="flex-1" scrollY>
        <View className="px-4 py-5">
          {loading ? (
            <View className="flex flex-col items-center justify-center py-16">
              <View className="mb-3 animate-spin">
                <RefreshCw size={32} color="#10B981" />
              </View>
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : newsList.length === 0 ? (
            <View className="bg-white rounded-2xl border border-gray-100 p-8">
              <View className="flex flex-col items-center">
                <View className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Newspaper size={36} color="#D1D5DB" />
                </View>
                <Text className="block text-base text-gray-700 mb-1 font-medium">暂无新闻</Text>
                <Text className="block text-sm text-gray-400">下拉刷新获取最新新闻</Text>
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              {newsList.slice(0, 3).map((news, index) => (
                <View
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  onClick={() => openNews(news.url)}
                >
                  {/* 新闻标题 */}
                  <Text className="block text-base font-bold text-gray-800 mb-3 line-clamp-2 leading-relaxed">
                    {news.title}
                  </Text>

                  {/* 新闻描述 */}
                  {news.description && (
                    <Text className="block text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                      {news.description}
                    </Text>
                  )}

                  {/* 底部信息 */}
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center">
                      <Clock size={14} color="#9CA3AF" />
                      <Text className="block text-xs text-gray-400 ml-1">
                        {news.publish_time || '刚刚'}
                      </Text>
                      {news.source && (
                        <>
                          <Text className="block text-xs text-gray-300 mx-2">·</Text>
                          <Text className="block text-xs text-gray-500">
                            {news.source}
                          </Text>
                        </>
                      )}
                    </View>
                    <ExternalLink size={16} color="#10B981" />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 底部提示 */}
          {newsList.length > 0 && (
            <View className="mt-4 flex flex-row items-center justify-center">
              <Text className="block text-xs text-gray-400">
                只展示前 3 条热点新闻
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default NewsPage

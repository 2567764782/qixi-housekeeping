import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Clock, ExternalLink, ArrowLeft } from 'lucide-react-taro'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface NewsDetail {
  title: string
  url: string
  source?: string
  publish_time?: string
  description?: string
}

const NewsDetailPage = () => {
  const [news, setNews] = useState<NewsDetail | null>(null)

  useLoad(() => {
    // 从路由参数获取新闻信息
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params
    
    if (params) {
      const newsData: NewsDetail = {
        title: decodeURIComponent(params.title || ''),
        url: decodeURIComponent(params.url || ''),
        source: params.source ? decodeURIComponent(params.source) : '头条号',
        publish_time: params.publish_time || new Date().toISOString(),
        description: params.description ? decodeURIComponent(params.description) : ''
      }
      setNews(newsData)
    }
  })

  // 格式化日期
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '刚刚'
    
    try {
      const date = new Date(dateStr)
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return '刚刚'
      }
      
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      
      // 小于1分钟
      if (diff < 60000) {
        return '刚刚'
      }
      // 小于1小时
      if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`
      }
      // 小于24小时
      if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`
      }
      // 大于24小时，显示具体日期
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return '刚刚'
    }
  }

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack()
  }

  // 在浏览器中打开原文链接
  const openOriginal = () => {
    if (news?.url && !news.url.includes('example.com')) {
      // 如果是真实链接，在浏览器中打开
      Taro.setClipboardData({
        data: news.url,
        success: () => {
          Taro.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    } else {
      Taro.showToast({
        title: '这是模拟新闻',
        icon: 'none'
      })
    }
  }

  if (!news) {
    return (
      <View className="flex flex-col h-full bg-gray-50">
        <View className="flex flex-col items-center justify-center h-full">
          <Text className="block text-gray-500">加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 顶部导航栏 */}
      <View className="bg-white px-4 py-4 flex flex-row items-center border-b border-gray-100">
        <View className="flex flex-row items-center" onClick={handleBack}>
          <ArrowLeft size={24} color="#374151" />
        </View>
        <Text className="block flex-1 text-center text-lg font-bold text-gray-800">
          新闻详情
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1" scrollY>
        <View className="p-5">
          {/* 新闻卡片 */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* 新闻标题 */}
            <Text className="block text-xl font-bold text-gray-800 mb-4 leading-relaxed">
              {news.title}
            </Text>

            {/* 来源和时间 */}
            <View className="flex flex-row items-center mb-6 pb-4 border-b border-gray-100">
              <View className="flex flex-row items-center mr-4">
                <Clock size={14} color="#9CA3AF" />
                <Text className="block text-sm text-gray-500 ml-1">
                  {formatDate(news.publish_time)}
                </Text>
              </View>
              {news.source && (
                <View className="bg-emerald-50 px-3 py-1 rounded-full">
                  <Text className="block text-xs text-emerald-600 font-medium">
                    {news.source}
                  </Text>
                </View>
              )}
            </View>

            {/* 新闻内容 */}
            <View className="mb-6">
              {news.description ? (
                <Text className="block text-base text-gray-700 leading-relaxed">
                  {news.description}
                </Text>
              ) : (
                <Text className="block text-base text-gray-700 leading-relaxed">
                  这是新闻的详细内容。在实际应用中，这里会显示完整的新闻正文，
                  包括多段文字、图片、视频等多媒体内容。
                </Text>
              )}
            </View>

            {/* 分割线 */}
            <View className="border-t border-gray-100 pt-4">
              <Text className="block text-sm text-gray-400 mb-4">
                以上为新闻摘要，点击下方按钮可查看原文链接。
              </Text>
              
              {/* 打开原文按钮 */}
              <View
                className="flex flex-row items-center justify-center bg-emerald-50 rounded-xl py-3"
                onClick={openOriginal}
              >
                <ExternalLink size={18} color="#10B981" />
                <Text className="block text-sm text-emerald-600 font-medium ml-2">
                  查看原文链接
                </Text>
              </View>
            </View>
          </View>

          {/* 温馨提示 */}
          <View className="mt-4 bg-blue-50 rounded-xl p-4">
            <Text className="block text-sm text-blue-600">
              💡 提示：当前使用的是模拟新闻数据。配置后端服务后，将显示真实的新闻内容。
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default NewsDetailPage

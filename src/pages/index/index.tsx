import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket, ChevronRight, Star, Calendar, FileText, User, Search, Newspaper } from 'lucide-react-taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

// 服务类型定义
interface ServiceType {
  id: string
  name: string
  description: string
  icon: string
  price: string
  category: 'cleaning' | 'renovation'
}

// 新闻类型定义
interface NewsItem {
  title: string
  url: string
  source?: string
  publish_time?: string
  description?: string
}

// 快捷入口类型定义
interface QuickAction {
  id: string
  name: string
  icon: string
  color: string
}

const IndexPage = () => {
  useLoad(() => {
    loadServices()
    loadNews()
  })

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cleaning' | 'renovation'>('all')
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(false)
  const [newsList, setNewsList] = useState<NewsItem[]>([])

  // 快捷入口数据
  const quickActions: QuickAction[] = [
    { id: '1', name: '服务预约', icon: 'Calendar', color: 'bg-emerald-500' },
    { id: '2', name: '我的订单', icon: 'FileText', color: 'bg-blue-500' },
    { id: '3', name: '实时新闻', icon: 'Newspaper', color: 'bg-orange-500' },
    { id: '4', name: '个人中心', icon: 'User', color: 'bg-purple-500' },
  ]

  // 加载服务列表
  const loadServices = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/services',
        method: 'GET'
      })
      console.log('🔧 服务数据:', res.data)
      // 后端返回的是 { services: [...], total, page, limit, totalPages }
      const servicesData = res.data?.services || res.data || []
      setServices(servicesData)
    } catch (error) {
      console.error('Failed to load services, using mock data:', error)
      // 如果后端不可用，使用模拟数据
      const mockServices: ServiceType[] = [
        {
          id: '1',
          name: '日常保洁',
          description: '家庭日常清洁，包括厨房、卫生间、客厅等',
          icon: 'Sparkles',
          price: '88元/次',
          category: 'cleaning'
        },
        {
          id: '2',
          name: '深度保洁',
          description: '全面深度清洁，彻底清除污渍和死角',
          icon: 'Sparkles',
          price: '258元/次',
          category: 'cleaning'
        },
        {
          id: '3',
          name: '厨房改造',
          description: '橱柜更换、水电改造、瓷砖翻新',
          icon: 'Wrench',
          price: '起价5000元',
          category: 'renovation'
        },
        {
          id: '4',
          name: '卫生间改造',
          description: '卫浴设施更换、防水处理、空间优化',
          icon: 'Wrench',
          price: '起价8000元',
          category: 'renovation'
        },
        {
          id: '5',
          name: '墙面刷新',
          description: '墙面修补、重新刷漆、色彩搭配',
          icon: 'PaintBucket',
          price: '35元/平米',
          category: 'renovation'
        },
        {
          id: '6',
          name: '地板更换',
          description: '地板拆除、新地板铺设、踢脚线处理',
          icon: 'Building2',
          price: '120元/平米',
          category: 'renovation'
        }
      ]
      setServices(mockServices)
    } finally {
      setLoading(false)
    }
  }

  // 加载新闻列表
  const loadNews = async () => {
    try {
      const res = await Network.request({
        url: '/api/news/toutiao',
        method: 'GET'
      })
      console.log('📰 首页新闻数据:', res.data)
      setNewsList(res.data || [])
    } catch (error) {
      console.error('Failed to load news, using mock data:', error)
      // 如果后端不可用，使用模拟数据
      const mockNews = [
        {
          title: '财经新闻：最新市场动态分析',
          url: 'https://example.com/news/finance/1',
          source: '头条号',
          publish_time: new Date().toISOString(),
          description: '这是一条关于财经领域的最新报道...'
        },
        {
          title: '娱乐热点：明星动态与影视资讯',
          url: 'https://example.com/news/entertainment/2',
          source: '头条号',
          publish_time: new Date(Date.now() - 3600000).toISOString(),
          description: '娱乐圈最新动态...'
        },
        {
          title: '家庭生活：家政服务小技巧',
          url: 'https://example.com/news/family/3',
          source: '头条号',
          publish_time: new Date(Date.now() - 7200000).toISOString(),
          description: '实用的家庭清洁技巧...'
        }
      ]
      setNewsList(mockNews)
    }
  }

  // 获取快捷入口图标
  const getQuickActionIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Calendar: <Calendar size={24} color="#fff" />,
      FileText: <FileText size={24} color="#fff" />,
      Newspaper: <Newspaper size={24} color="#fff" />,
      User: <User size={24} color="#fff" />,
    }
    return iconMap[iconName] || <Sparkles size={24} color="#fff" />
  }

  // 根据图标名称获取图标组件
  const getIconComponent = (iconName: string, size: number = 40) => {
    const iconMap: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
      Sparkles: {
        icon: <Sparkles size={size} color="#fff" />,
        bg: 'bg-emerald-500',
        color: '#10B981'
      },
      Wrench: {
        icon: <Wrench size={size} color="#fff" />,
        bg: 'bg-emerald-500',
        color: '#10B981'
      },
      Building2: {
        icon: <Building2 size={size} color="#fff" />,
        bg: 'bg-emerald-500',
        color: '#10B981'
      },
      Sofa: {
        icon: <Sofa size={size} color="#fff" />,
        bg: 'bg-emerald-500',
        color: '#10B981'
      },
      PaintBucket: {
        icon: <PaintBucket size={size} color="#fff" />,
        bg: 'bg-emerald-500',
        color: '#10B981'
      }
    }
    return iconMap[iconName] || iconMap.Sparkles
  }

  // 跳转到预约页面
  const handleServiceClick = (service: ServiceType) => {
    Taro.navigateTo({
      url: `/pages/booking/index?name=${encodeURIComponent(service.name)}&id=${service.id}`
    })
  }

  // 处理快捷入口点击
  const handleQuickActionClick = (actionId: string) => {
    const pageMap: Record<string, string> = {
      '1': '/pages/booking/index',
      '2': '/pages/orders/index',
      '3': '/pages/news/index',
      '4': '/pages/profile/index'
    }
    const url = pageMap[actionId]
    if (url) {
      if (actionId === '2') {
        Taro.switchTab({ url })
      } else {
        Taro.navigateTo({ url })
      }
    } else {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    }
  }

  // 过滤服务
  const filteredServices = services.filter(service => {
    if (selectedCategory === 'all') return true
    return service.category === selectedCategory
  })

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 搜索栏 */}
        <View className="bg-white px-4 py-4">
          <View className="bg-gray-100 rounded-2xl px-4 py-3 flex flex-row items-center">
            <Search size={18} color="#9CA3AF" />
            <Input className="flex-1 ml-2 bg-transparent text-base" placeholder="搜索服务..." />
          </View>
        </View>

        {/* 新闻轮播条 */}
        {newsList.length > 0 && (
          <View className="bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-3 border-b border-emerald-100">
            <View className="flex flex-row items-center">
              <Newspaper size={16} color="#10B981" />
              <Text className="block text-xs font-bold text-emerald-600 ml-2 mr-3">热点</Text>
              <ScrollView scrollX className="flex-1" showScrollbar={false}>
                <View className="flex flex-row items-center">
                  {newsList.slice(0, 3).map((news, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center mr-4"
                      onClick={() => Taro.navigateTo({
                        url: `/pages/webview/index?url=${encodeURIComponent(news.url)}`
                      })}
                    >
                      <Text className="block text-sm text-gray-700 line-clamp-1">
                        {news.title}
                      </Text>
                      {index < 2 && newsList.length > 1 && (
                        <View className="w-1 h-1 bg-gray-300 rounded-full mx-3" />
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* 快捷入口 */}
        <View className="px-4 py-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <View className="flex flex-row justify-around">
              {quickActions.map((action) => (
                <View key={action.id} className="flex flex-col items-center" onClick={() => handleQuickActionClick(action.id)}>
                  <View
                    className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-2 shadow-sm`}
                  >
                    {getQuickActionIcon(action.icon)}
                  </View>
                  <Text className="block text-sm text-gray-700 text-center font-medium">{action.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 服务分类 */}
        <View className="px-4 pb-4">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="block text-lg font-bold text-gray-800">服务分类</Text>
            <View className="flex flex-row items-center" onClick={() => Taro.showToast({ title: '查看全部', icon: 'none' })}>
              <Text className="block text-sm text-gray-500 mr-1">全部</Text>
              <ChevronRight size={14} color="#9CA3AF" />
            </View>
          </View>

          <View className="flex flex-row gap-3">
            <View
              className={`flex-1 py-3 rounded-xl text-center font-medium text-sm transition-all ${
                selectedCategory === 'all' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              全部
            </View>
            <View
              className={`flex-1 py-3 rounded-xl text-center font-medium text-sm transition-all ${
                selectedCategory === 'cleaning' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
              }`}
              onClick={() => setSelectedCategory('cleaning')}
            >
              保洁服务
            </View>
            <View
              className={`flex-1 py-3 rounded-xl text-center font-medium text-sm transition-all ${
                selectedCategory === 'renovation' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
              }`}
              onClick={() => setSelectedCategory('renovation')}
            >
              局部改造
            </View>
          </View>
        </View>

        {/* 服务列表 */}
        <View className="px-4 pb-8">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="block text-lg font-bold text-gray-800">热门服务</Text>
          </View>

          {loading ? (
            <View className="flex flex-col items-center justify-center py-12">
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : filteredServices.length === 0 ? (
            <View className="bg-white rounded-2xl border border-gray-100 p-8">
              <View className="flex flex-col items-center">
                <View className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles size={36} color="#D1D5DB" />
                </View>
                <Text className="block text-base text-gray-500 mb-1">暂无服务</Text>
                <Text className="block text-sm text-gray-400">服务列表正在更新中</Text>
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredServices.map((service) => {
                const iconData = getIconComponent(service.icon)
                return (
                  <View
                    key={service.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-row items-center"
                    onClick={() => handleServiceClick(service)}
                  >
                    {/* 服务图标 */}
                    <View
                      className={`w-16 h-16 ${iconData.bg} rounded-2xl flex items-center justify-center mr-4 shadow-sm`}
                    >
                      {iconData.icon}
                    </View>

                    {/* 服务信息 */}
                    <View className="flex-1">
                      <Text className="block text-base font-bold text-gray-800 mb-1">
                        {service.name}
                      </Text>
                      <Text className="block text-sm text-gray-500 mb-2 line-clamp-1">
                        {service.description}
                      </Text>
                      <View className="flex flex-row items-center">
                        <Text className="block text-sm font-bold text-emerald-600">
                          {service.price}
                        </Text>
                        <View className="flex flex-row items-center ml-3">
                          <Star size={12} color="#F59E0B" />
                          <Text className="block text-xs text-gray-500 ml-1">4.9</Text>
                        </View>
                      </View>
                    </View>

                    {/* 右箭头 */}
                    <View className="ml-2">
                      <ChevronRight size={20} color="#D1D5DB" />
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage

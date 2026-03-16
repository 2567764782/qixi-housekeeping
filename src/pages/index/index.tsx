import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket, ChevronRight, Star, Calendar, FileText, User, Search, Newspaper, Droplets, Phone } from 'lucide-react-taro'
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
  category: 'cleaning' | 'washing'
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

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cleaning' | 'washing'>('all')
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(false)
  const [newsList, setNewsList] = useState<NewsItem[]>([])

  // 快捷入口数据
  const quickActions: QuickAction[] = [
    { id: '1', name: '服务预约', icon: 'Calendar', color: 'bg-emerald-500' },
    { id: '2', name: '我的订单', icon: 'FileText', color: 'bg-blue-500' },
    { id: '3', name: '联系师傅', icon: 'Phone', color: 'bg-orange-500' },
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
      
      // 检查响应是否成功（状态码 200 且有数据）
      if (res.statusCode === 200 && res.data) {
        // 后端返回的是 { services: [...], total, page, limit, totalPages }
        const servicesData = res.data?.services || res.data || []
        setServices(servicesData)
      } else {
        // 后端返回错误状态码，使用模拟数据
        console.warn('后端返回错误状态码，使用模拟数据')
        getMockServices()
      }
    } catch (error) {
      console.error('Failed to load services, using mock data:', error)
      getMockServices()
    } finally {
      setLoading(false)
    }
  }

  // 使用模拟服务数据
  const getMockServices = () => {
    const mockServices: ServiceType[] = [
      {
        id: '1',
        name: '日常保洁',
        description: '全屋除尘、地面清洁、物品整理',
        icon: 'Sparkles',
        price: '50元/小时',
        category: 'cleaning'
      },
      {
        id: '2',
        name: '深度保洁',
        description: '全屋深度清洁、除菌消毒、除螨除味',
        icon: 'Sparkles',
        price: '100元/小时',
        category: 'cleaning'
      },
      {
        id: '3',
        name: '开荒保洁',
        description: '新房装修后清洁、除胶除漆、精细擦洗',
        icon: 'Sparkles',
        price: '8元/平米',
        category: 'cleaning'
      },
      {
        id: '4',
        name: '家电清洗',
        description: '空调、油烟机、洗衣机深度清洗',
        icon: 'Droplets',
        price: '80元/台起',
        category: 'washing'
      },
      {
        id: '5',
        name: '沙发清洗',
        description: '布艺沙发、真皮沙发深层清洁养护',
        icon: 'Droplets',
        price: '200元/座',
        category: 'washing'
      },
      {
        id: '6',
        name: '地毯清洗',
        description: '专业地毯清洗、除螨杀菌、快速干燥',
        icon: 'Droplets',
        price: '15元/平米',
        category: 'washing'
      }
    ]
    setServices(mockServices)
  }

  // 加载新闻列表
  const loadNews = async () => {
    try {
      const res = await Network.request({
        url: '/api/news/toutiao',
        method: 'GET'
      })
      console.log('📰 首页新闻数据:', res.data)
      
      // 检查响应是否成功（状态码 200 且有数据）
      if (res.statusCode === 200 && res.data) {
        setNewsList(res.data || [])
      } else {
        // 后端返回错误状态码，使用模拟数据
        console.warn('后端返回错误状态码，使用模拟新闻数据')
        getMockNews()
      }
    } catch (error) {
      console.error('Failed to load news, using mock data:', error)
      getMockNews()
    }
  }

  // 使用模拟新闻数据
  const getMockNews = () => {
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

  // 获取快捷入口图标
  const getQuickActionIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Calendar: <Calendar size={24} color="#fff" />,
      FileText: <FileText size={24} color="#fff" />,
      Phone: <Phone size={24} color="#fff" />,
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
      Droplets: {
        icon: <Droplets size={size} color="#fff" />,
        bg: 'bg-blue-500',
        color: '#3B82F6'
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
    if (actionId === '3') {
      // 联系师傅 - 拨打客服电话
      Taro.makePhoneCall({
        phoneNumber: '400-888-9999', // 客服电话
        fail: () => {
          Taro.showToast({
            title: '拨打失败',
            icon: 'none'
          })
        }
      })
      return
    }
    
    const pageMap: Record<string, string> = {
      '1': '/pages/booking/index',
      '2': '/pages/orders/index',
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
                        url: `/pages/news-detail/index?title=${encodeURIComponent(news.title)}&url=${encodeURIComponent(news.url)}&source=${encodeURIComponent(news.source || '头条号')}&publish_time=${encodeURIComponent(news.publish_time || '')}&description=${encodeURIComponent(news.description || '')}`
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
                selectedCategory === 'washing' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
              }`}
              onClick={() => setSelectedCategory('washing')}
            >
              清洗服务
            </View>
          </View>
        </View>

        {/* 热门服务 - 模块化布局 */}
        <View className="px-4 pb-8">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="block text-lg font-bold text-gray-800">热门服务</Text>
            <View className="flex flex-row items-center" onClick={() => Taro.navigateTo({ url: '/pages/service-list/index' })}>
              <Text className="block text-sm text-gray-500 mr-1">全部</Text>
              <ChevronRight size={14} color="#9CA3AF" />
            </View>
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
            <View className="flex flex-col gap-3">
              {/* 第一行：1个大卡片 + 2个小卡片 */}
              <View style={{ display: 'flex', flexDirection: 'row', gap: '12px', height: '180px' }}>
                {/* 大卡片 - 日常保洁 */}
                {filteredServices[0] && (
                  <View
                    className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
                    style={{ flex: '1 1 55%' }}
                    onClick={() => handleServiceClick(filteredServices[0])}
                  >
                    <View>
                      <View className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                        <Sparkles size={28} color="#fff" />
                      </View>
                      <Text className="block text-xl font-bold text-white mb-1">{filteredServices[0].name}</Text>
                      <Text className="block text-sm text-white/80 line-clamp-2">{filteredServices[0].description}</Text>
                    </View>
                    <View className="flex flex-row items-center justify-between">
                      <Text className="block text-base font-bold text-white">{filteredServices[0].price}</Text>
                      <View className="flex flex-row items-center bg-white/20 rounded-full px-3 py-1">
                        <Star size={12} color="#FCD34D" />
                        <Text className="block text-xs text-white ml-1">4.9</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* 右侧两个小卡片 */}
                <View style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredServices.slice(1, 3).map((service, index) => {
                    const iconData = getIconComponent(service.icon, 24)
                    const colors = [
                      'bg-gradient-to-br from-blue-500 to-blue-600',
                      'bg-gradient-to-br from-purple-500 to-purple-600'
                    ]
                    return (
                      <View
                        key={service.id}
                        className={`flex-1 ${colors[index]} rounded-2xl p-3 shadow-md flex flex-row items-center`}
                        onClick={() => handleServiceClick(service)}
                      >
                        <View className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                          {iconData.icon}
                        </View>
                        <View className="flex-1">
                          <Text className="block text-base font-bold text-white">{service.name}</Text>
                          <Text className="block text-xs text-white/80">{service.price}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>

              {/* 第二行：横向中等卡片 */}
              {filteredServices[3] && (
                <View
                  className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 shadow-md flex flex-row items-center"
                  style={{ height: '100px' }}
                  onClick={() => handleServiceClick(filteredServices[3])}
                >
                  <View className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <Wrench size={32} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="block text-lg font-bold text-white mb-1">{filteredServices[3].name}</Text>
                    <Text className="block text-sm text-white/80 line-clamp-1">{filteredServices[3].description}</Text>
                  </View>
                  <View className="flex flex-col items-end">
                    <Text className="block text-base font-bold text-white">{filteredServices[3].price}</Text>
                    <View className="flex flex-row items-center mt-1">
                      <Star size={12} color="#FCD34D" />
                      <Text className="block text-xs text-white ml-1">4.8</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* 第三行：横向大卡片 */}
              {filteredServices[4] && (
                <View
                  className="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl p-5 shadow-md flex flex-row items-center justify-between"
                  style={{ height: '90px' }}
                  onClick={() => handleServiceClick(filteredServices[4])}
                >
                  <View className="flex flex-row items-center flex-1">
                    <View className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <PaintBucket size={32} color="#fff" />
                    </View>
                    <View className="flex-1">
                      <Text className="block text-lg font-bold text-white mb-1">{filteredServices[4].name}</Text>
                      <Text className="block text-sm text-white/80">{filteredServices[4].description}</Text>
                    </View>
                  </View>
                  <View className="flex flex-col items-end ml-4">
                    <Text className="block text-base font-bold text-white">{filteredServices[4].price}</Text>
                    <View className="flex flex-row items-center mt-1">
                      <Star size={12} color="#FCD34D" />
                      <Text className="block text-xs text-white ml-1">4.9</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* 第四行：四个小卡片 */}
              <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                {filteredServices.slice(5, 8).map((service, index) => {
                  const iconData = getIconComponent(service.icon, 20)
                  const colors = [
                    'bg-gradient-to-br from-pink-500 to-rose-500',
                    'bg-gradient-to-br from-indigo-500 to-purple-500',
                    'bg-gradient-to-br from-amber-500 to-orange-500'
                  ]
                  return (
                    <View
                      key={service.id}
                      className={`flex-1 ${colors[index % 3]} rounded-2xl p-3 shadow-sm`}
                      style={{ height: '90px' }}
                      onClick={() => handleServiceClick(service)}
                    >
                      <View className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                        {iconData.icon}
                      </View>
                      <Text className="block text-sm font-bold text-white">{service.name}</Text>
                      <Text className="block text-xs text-white/80 mt-1">{service.price}</Text>
                    </View>
                  )
                })}
                {/* 更多服务卡片 */}
                <View
                  className="flex-1 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center"
                  style={{ height: '90px' }}
                  onClick={() => Taro.navigateTo({ url: '/pages/service-list/index' })}
                >
                  <View className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                    <ChevronRight size={24} color="#fff" />
                  </View>
                  <Text className="block text-sm font-bold text-white">更多服务</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage

import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket, ChevronRight, Star, FileText, Video, Share2, Users, CreditCard } from 'lucide-react-taro'
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

// 快捷入口类型定义
interface QuickAction {
  id: string
  name: string
  icon: string
  color: string
}

const IndexPage = () => {
  useLoad(() => {
    console.log('Page loaded')
    loadServices()
  })

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cleaning' | 'renovation'>('all')
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(false)

  // 快捷入口数据
  const quickActions: QuickAction[] = [
    { id: '1', name: '我的名片', icon: 'CreditCard', color: 'from-blue-500 to-blue-600' },
    { id: '2', name: '上传素材', icon: 'FileText', color: 'from-green-500 to-green-600' },
    { id: '3', name: '视频获客', icon: 'Video', color: 'from-orange-500 to-orange-600' },
    { id: '4', name: '我的团队', icon: 'Users', color: 'from-blue-500 to-blue-600' },
    { id: '5', name: '海报获客', icon: 'Share2', color: 'from-orange-500 to-orange-600' },
  ]

  // 加载服务列表
  const loadServices = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/services',
        method: 'GET'
      })
      console.log('Services response:', res.data)
      setServices(res.data || [])
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取快捷入口图标
  const getQuickActionIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      CreditCard: <CreditCard size={24} color="#fff" />,
      FileText: <FileText size={24} color="#fff" />,
      Video: <Video size={24} color="#fff" />,
      Users: <Users size={24} color="#fff" />,
      Share2: <Share2 size={24} color="#fff" />,
    }
    return iconMap[iconName] || <Sparkles size={24} color="#fff" />
  }

  // 根据图标名称获取图标组件
  const getIconComponent = (iconName: string, size: number = 40) => {
    const iconMap: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
      Sparkles: {
        icon: <Sparkles size={size} color="#fff" />,
        bg: 'bg-blue-500',
        color: '#3B82F6'
      },
      Wrench: {
        icon: <Wrench size={size} color="#fff" />,
        bg: 'bg-blue-500',
        color: '#3B82F6'
      },
      Building2: {
        icon: <Building2 size={size} color="#fff" />,
        bg: 'bg-blue-500',
        color: '#3B82F6'
      },
      Sofa: {
        icon: <Sofa size={size} color="#fff" />,
        bg: 'bg-blue-500',
        color: '#3B82F6'
      },
      PaintBucket: {
        icon: <PaintBucket size={size} color="#fff" />,
        bg: 'bg-blue-500',
        color: '#3B82F6'
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

  // 过滤服务
  const filteredServices = services.filter(service => {
    if (selectedCategory === 'all') return true
    return service.category === selectedCategory
  })

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 顶部科技风轮播横幅 */}
        <View className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 pt-12 pb-8 px-6">
          {/* 背景装饰圆 */}
          <View className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <View className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <View className="relative">
            {/* 轮播文字 */}
            <View className="mb-3">
              <Text className="block text-2xl font-bold text-white mb-2">
                2024年
              </Text>
              <Text className="block text-3xl font-bold text-white leading-tight mb-2">
                专业保洁服务
              </Text>
              <Text className="block text-lg text-blue-50 font-medium">
                科技、品质 决定未来
              </Text>
            </View>

            {/* 副标题 + 评分 */}
            <View className="flex flex-row items-center mt-4">
              <View className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
                <Star size={16} color="#FFD700" />
                <Text className="block text-sm text-white font-semibold ml-1">4.9</Text>
                <Text className="block text-xs text-white/80 ml-1">评分</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 快捷入口 - 一行5个图标 */}
        <View className="px-4 -mt-4 mb-4 relative z-10">
          <View className="bg-white rounded-2xl shadow-md p-4">
            <View className="flex flex-row justify-around">
              {quickActions.map((action) => (
                <View key={action.id} className="flex flex-col items-center">
                  <View
                    className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-2 shadow-sm`}
                  >
                    {getQuickActionIcon(action.icon)}
                  </View>
                  <Text className="block text-xs text-gray-700 text-center">{action.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 资讯早报卡片 */}
        <View className="px-4 mb-4">
          <View
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <View className="flex flex-row items-start">
              <View className="flex-1">
                <View className="flex flex-row items-center mb-2">
                  <View className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mr-2">
                    今日早报
                  </View>
                </View>
                <Text className="block text-sm text-gray-800 leading-relaxed line-clamp-2">
                  保洁服务行业迎来新机遇，智能设备提升服务效率，用户满意度持续提升
                </Text>
              </View>
              <View className="ml-3 flex items-center justify-center">
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </View>
          </View>
        </View>

        {/* 分类筛选 */}
        <View className="px-4 mb-4">
          <View className="flex flex-row gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            <View
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-500'
                  : 'bg-transparent'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              <Text
                className={`block text-sm font-semibold ${
                  selectedCategory === 'all' ? 'text-white' : 'text-gray-600'
                }`}
              >
                全部
              </Text>
            </View>
            <View
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                selectedCategory === 'cleaning'
                  ? 'bg-blue-500'
                  : 'bg-transparent'
              }`}
              onClick={() => setSelectedCategory('cleaning')}
            >
              <Text
                className={`block text-sm font-semibold ${
                  selectedCategory === 'cleaning' ? 'text-white' : 'text-gray-600'
                }`}
              >
                保洁服务
              </Text>
            </View>
            <View
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                selectedCategory === 'renovation'
                  ? 'bg-blue-500'
                  : 'bg-transparent'
              }`}
              onClick={() => setSelectedCategory('renovation')}
            >
              <Text
                className={`block text-sm font-semibold ${
                  selectedCategory === 'renovation' ? 'text-white' : 'text-gray-600'
                }`}
              >
                局部改造
              </Text>
            </View>
          </View>
        </View>

        {/* 服务列表 */}
        <View className="px-4 pb-8">
          {loading ? (
            <View className="flex flex-col items-center justify-center py-16">
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : filteredServices.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-16">
              <Text className="block text-sm text-gray-500">暂无服务</Text>
            </View>
          ) : (
            filteredServices.map((service) => {
              const iconData = getIconComponent(service.icon, 48)
              return (
                <View
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                  onClick={() => handleServiceClick(service)}
                >
                  <View className="flex flex-row items-center">
                    {/* 左侧图标 */}
                    <View
                      className={`w-16 h-16 ${iconData.bg} rounded-2xl flex items-center justify-center mr-4 flex-shrink-0`}
                      style={{
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      {iconData.icon}
                    </View>

                    {/* 中间内容 */}
                    <View className="flex-1">
                      <Text className="block text-base font-bold text-gray-800 mb-1">
                        {service.name}
                      </Text>
                      <Text className="block text-xs text-gray-500 leading-relaxed line-clamp-1">
                        {service.description}
                      </Text>
                      <Text className="block text-sm font-semibold text-blue-600 mt-1">
                        {service.price}
                      </Text>
                    </View>

                    {/* 右侧箭头 */}
                    <View className="flex items-center justify-center">
                      <ChevronRight size={24} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage

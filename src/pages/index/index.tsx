import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket, ChevronRight, Star } from 'lucide-react-taro'
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

const IndexPage = () => {
  useLoad(() => {
    console.log('Page loaded')
    loadServices()
  })

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cleaning' | 'renovation'>('all')
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(false)

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
        bg: 'bg-amber-500',
        color: '#F59E0B'
      },
      Building2: {
        icon: <Building2 size={size} color="#fff" />,
        bg: 'bg-purple-500',
        color: '#8B5CF6'
      },
      Sofa: {
        icon: <Sofa size={size} color="#fff" />,
        bg: 'bg-red-500',
        color: '#EF4444'
      },
      PaintBucket: {
        icon: <PaintBucket size={size} color="#fff" />,
        bg: 'bg-rose-500',
        color: '#F43F5E'
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
      {/* 顶部 Banner */}
      <View className="bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 p-6 pt-8">
        <View className="flex flex-row items-center justify-between mb-3">
          <View>
            <Text className="block text-2xl font-bold text-white">专业保洁</Text>
            <Text className="block text-xl font-semibold text-white">局部改造</Text>
          </View>
          <Star size={28} color="#FFD700" />
        </View>
        <Text className="block text-sm text-emerald-100 opacity-90">
          提供专业、高效、可靠的家居服务
        </Text>
      </View>

      {/* 统计信息 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex flex-row justify-around">
          <View className="text-center">
            <Text className="block text-lg font-bold text-emerald-600">6+</Text>
            <Text className="block text-xs text-gray-500">服务项目</Text>
          </View>
          <View className="text-center">
            <Text className="block text-lg font-bold text-emerald-600">1000+</Text>
            <Text className="block text-xs text-gray-500">服务次数</Text>
          </View>
          <View className="text-center">
            <Text className="block text-lg font-bold text-emerald-600">98%</Text>
            <Text className="block text-xs text-gray-500">好评率</Text>
          </View>
        </View>
      </View>

      {/* 分类筛选 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <View className="flex flex-row gap-3">
          <View
            className={`flex-1 px-4 py-2.5 rounded-xl text-center transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 shadow-md'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <Text className={`block text-sm font-semibold ${selectedCategory === 'all' ? 'text-white' : 'text-gray-600'}`}>
              全部
            </Text>
          </View>
          <View
            className={`flex-1 px-4 py-2.5 rounded-xl text-center transition-all ${
              selectedCategory === 'cleaning'
                ? 'bg-emerald-500 shadow-md'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('cleaning')}
          >
            <Text className={`block text-sm font-semibold ${selectedCategory === 'cleaning' ? 'text-white' : 'text-gray-600'}`}>
              保洁服务
            </Text>
          </View>
          <View
            className={`flex-1 px-4 py-2.5 rounded-xl text-center transition-all ${
              selectedCategory === 'renovation'
                ? 'bg-emerald-500 shadow-md'
                : 'bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('renovation')}
          >
            <Text className={`block text-sm font-semibold ${selectedCategory === 'renovation' ? 'text-white' : 'text-gray-600'}`}>
              局部改造
            </Text>
          </View>
        </View>
      </View>

      {/* 服务列表 */}
      <ScrollView className="flex-1 px-4 py-4" scrollY>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-sm text-gray-500">加载中...</Text>
          </View>
        ) : filteredServices.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-base text-gray-500">暂无服务</Text>
          </View>
        ) : (
          <View className="grid grid-cols-1 gap-4 pb-6">
            {filteredServices.map(service => {
              const iconData = getIconComponent(service.icon, 28)
              return (
                <View
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => handleServiceClick(service)}
                >
                  <View className="flex flex-row items-stretch">
                    {/* 左侧图标 */}
                    <View className={`${iconData.bg} w-24 flex items-center justify-center flex-shrink-0`}>
                      {iconData.icon}
                    </View>

                    {/* 右侧内容 */}
                    <View className="flex-1 p-4 flex flex-col justify-between">
                      <View>
                        <View className="flex flex-row items-center justify-between mb-1">
                          <Text className="block text-lg font-bold text-gray-800">
                            {service.name}
                          </Text>
                          <ChevronRight size={20} color="#9CA3AF" />
                        </View>
                        <Text className="block text-sm text-gray-500 leading-relaxed mb-3">
                          {service.description}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center justify-between">
                        <Text
                          className="block text-lg font-bold"
                          style={{ color: iconData.color }}
                        >
                          {service.price}
                        </Text>
                        <View className="bg-emerald-50 px-3 py-1.5 rounded-full">
                          <Text className="block text-xs text-emerald-600 font-semibold">
                            立即预约
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default IndexPage

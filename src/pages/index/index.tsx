import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket } from 'lucide-react-taro'
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
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles size={32} color="#10B981" />,
      Wrench: <Wrench size={32} color="#F59E0B" />,
      Building2: <Building2 size={32} color="#8B5CF6" />,
      Sofa: <Sofa size={32} color="#EF4444" />,
      PaintBucket: <PaintBucket size={32} color="#EF4444" />
    }
    return iconMap[iconName] || <Sparkles size={32} color="#10B981" />
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
      <View className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-6">
        <Text className="block text-2xl font-bold text-white mb-2">专业保洁 · 局部改造</Text>
        <Text className="block text-sm text-emerald-50">为您提供专业的家政服务</Text>
      </View>

      {/* 分类筛选 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex flex-row gap-3">
          <View
            className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setSelectedCategory('all')}
          >
            <Text className="block text-sm">全部</Text>
          </View>
          <View
            className={`px-4 py-2 rounded-full ${selectedCategory === 'cleaning' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setSelectedCategory('cleaning')}
          >
            <Text className="block text-sm">保洁服务</Text>
          </View>
          <View
            className={`px-4 py-2 rounded-full ${selectedCategory === 'renovation' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setSelectedCategory('renovation')}
          >
            <Text className="block text-sm">局部改造</Text>
          </View>
        </View>
      </View>

      {/* 服务列表 */}
      <ScrollView className="flex-1 px-4 py-4" scrollY>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-sm text-gray-500">加载中...</Text>
          </View>
        ) : filteredServices.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-base text-gray-500">暂无服务</Text>
          </View>
        ) : (
          filteredServices.map(service => (
            <View
              key={service.id}
              className="bg-white rounded-xl shadow-sm p-4 mb-4"
              onClick={() => handleServiceClick(service)}
            >
              <View className="flex flex-row items-start">
                <View className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  {getIconComponent(service.icon)}
                </View>
                <View className="flex-1">
                  <Text className="block text-lg font-semibold mb-1">{service.name}</Text>
                  <Text className="block text-sm text-gray-500 mb-2">{service.description}</Text>
                  <Text className="block text-base text-emerald-600 font-semibold">{service.price}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default IndexPage

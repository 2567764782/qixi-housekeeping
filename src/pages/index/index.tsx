import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket, ChevronRight, Star, Search } from 'lucide-react-taro'
import { useState } from 'react'
import { Network } from '@/network'
import UserCarousel from '@/components/UserCarousel'
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

// 用户类型定义
interface UserType {
  id: string
  nickname: string
  city: string
  phone: string
  gender: string
}

const IndexPage = () => {
  useLoad(() => {
    console.log('Page loaded')
    loadServices()
    loadUsers()
  })

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cleaning' | 'renovation'>('all')
  const [services, setServices] = useState<ServiceType[]>([])
  const [users, setUsers] = useState<UserType[]>([])
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

  // 加载用户列表（用于轮播图）
  const loadUsers = async () => {
    try {
      const res = await Network.request({
        url: '/api/users/random',
        method: 'GET',
        data: { limit: 10 }
      })
      console.log('Users response:', res.data)
      setUsers(res.data || [])
    } catch (error) {
      console.error('Failed to load users:', error)
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
      <ScrollView className="flex-1" scrollY>
        {/* 顶部 Banner - 多层渐变 + 装饰 */}
        <View className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 pt-10 pb-8 px-6">
          {/* 背景装饰圆 */}
          <View className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <View className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <View className="relative">
            {/* 搜索栏 */}
            <View className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 mb-6 border border-white/30">
              <View className="flex flex-row items-center">
                <Search size={20} color="rgba(255,255,255,0.8)" className="mr-2" />
                <Text className="block flex-1 text-base text-white/80">搜索服务...</Text>
              </View>
            </View>

            {/* 主标题 */}
            <View className="mb-2">
              <Text className="block text-3xl font-bold text-white leading-tight mb-2">
                专业服务
              </Text>
              <Text className="block text-lg text-white/90 font-medium">
                值得信赖
              </Text>
            </View>

            {/* 副标题 + 评分 */}
            <View className="flex flex-row items-center mt-4">
              <View className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
                <Star size={16} color="#FFD700" className="mr-1" />
                <Text className="block text-sm text-white font-semibold">4.9</Text>
                <Text className="block text-xs text-white/80 ml-1">评分</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 统计信息 - 玻璃态卡片 */}
        <View className="mx-4 -mt-4 mb-6 relative z-10">
          <View className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 p-5">
            <View className="flex flex-row justify-around">
              <View className="text-center">
                <Text className="block text-2xl font-bold text-emerald-600 mb-1">6+</Text>
                <Text className="block text-xs text-gray-600">服务项目</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="text-center">
                <Text className="block text-2xl font-bold text-emerald-600 mb-1">1000+</Text>
                <Text className="block text-xs text-gray-600">服务次数</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="text-center">
                <Text className="block text-2xl font-bold text-emerald-600 mb-1">98%</Text>
                <Text className="block text-xs text-gray-600">好评率</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 分类筛选 - 胶囊式设计 */}
        <View className="px-4 mb-6">
          <View className="flex flex-row gap-2.5 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-gray-100">
            <View
              className={`flex-1 py-2.5 rounded-xl text-center transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 shadow-md'
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
              className={`flex-1 py-2.5 rounded-xl text-center transition-all duration-300 ${
                selectedCategory === 'cleaning'
                  ? 'bg-emerald-500 shadow-md'
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
              className={`flex-1 py-2.5 rounded-xl text-center transition-all duration-300 ${
                selectedCategory === 'renovation'
                  ? 'bg-emerald-500 shadow-md'
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

        {/* 用户轮播图 - 10万用户 */}
        <View className="px-4 mb-6">
          <UserCarousel users={users} interval={3000} />
        </View>

        {/* 服务列表 - 精致卡片设计 */}
        <View className="px-4 pb-8">
          {loading ? (
            <View className="flex flex-col items-center justify-center py-16">
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : filteredServices.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-16">
              <Text className="block text-base text-gray-500">暂无服务</Text>
            </View>
          ) : (
            <View className="grid grid-cols-1 gap-4">
              {filteredServices.map(service => {
                const iconData = getIconComponent(service.icon, 28)
                return (
                  <View
                    key={service.id}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
                    }}
                    onClick={() => handleServiceClick(service)}
                  >
                    <View className="flex flex-row items-stretch p-5">
                      {/* 左侧图标 */}
                      <View
                        className={`${iconData.bg} w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 mr-4`}
                        style={{
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                        }}
                      >
                        {iconData.icon}
                      </View>

                      {/* 右侧内容 */}
                      <View className="flex-1 flex flex-col justify-between py-1">
                        <View>
                          <View className="flex flex-row items-center justify-between mb-1.5">
                            <Text className="block text-lg font-bold text-gray-800">
                              {service.name}
                            </Text>
                            <ChevronRight size={20} color="#D1D5DB" />
                          </View>
                          <Text className="block text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {service.description}
                          </Text>
                        </View>
                        <View className="flex flex-row items-center justify-between mt-2">
                          <Text
                            className="block text-xl font-bold"
                            style={{ color: iconData.color }}
                          >
                            {service.price}
                          </Text>
                          <View
                            className="bg-emerald-50 px-4 py-2 rounded-xl"
                            style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}
                          >
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
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage

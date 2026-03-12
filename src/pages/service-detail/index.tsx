import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { Sparkles, Wrench, Building2, Sofa, PaintBucket, Info, Clock, Award, Phone } from 'lucide-react-taro'
import { Network } from '@/network'

interface ServiceDetail {
  id: string
  name: string
  description: string
  category: string
  price: string
  icon: string
  features?: string[]
  duration?: string
  rating?: number
  reviews?: number
}

const ServiceDetailPage = () => {
  const router = useRouter()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    const { id } = router.params
    if (id) {
      loadServiceDetail(id)
    }
  })

  const loadServiceDetail = async (serviceId: string) => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: `/api/services/${serviceId}`,
        method: 'GET'
      })
      setService(res.data)
    } catch (error) {
      console.error('Failed to load service detail:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleBooking = () => {
    if (service) {
      Taro.navigateTo({
        url: `/pages/booking/index?name=${encodeURIComponent(service.name)}&id=${service.id}`
      })
    }
  }

  const handleContact = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-8888'
    })
  }

  if (loading) {
    return (
      <View className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <Text className="block text-sm text-gray-500">加载中...</Text>
      </View>
    )
  }

  if (!service) {
    return (
      <View className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <Text className="block text-base text-gray-500">服务不存在</Text>
      </View>
    )
  }

  const iconData = getIconComponent(service.icon, 48)

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 顶部图标和名称 */}
        <View className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 pt-12 pb-8 px-6 relative overflow-hidden">
          {/* 背景装饰 */}
          <View className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <View className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <View className="relative z-10">
            <View
              className={`w-24 h-24 ${iconData.bg} rounded-3xl flex items-center justify-center mx-auto mb-4`}
              style={{
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              {iconData.icon}
            </View>

            <Text className="block text-3xl font-bold text-white text-center mb-2">
              {service.name}
            </Text>

            <View className="flex flex-row items-center justify-center gap-4 mb-4">
              <View className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Award size={16} color="#FFD700" className="mr-1" />
                <Text className="block text-sm text-white font-semibold">
                  {service.rating || 4.9} 分
                </Text>
              </View>
              <View className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Phone size={16} color="#fff" className="mr-1" />
                <Text className="block text-sm text-white font-semibold">
                  {service.reviews || 1000}+ 评价
                </Text>
              </View>
            </View>

            <Text className="block text-center text-2xl font-bold text-emerald-100">
              {service.price}
            </Text>
          </View>
        </View>

        {/* 内容卡片 */}
        <View className="px-4 py-6 space-y-4 -mt-6 relative z-10">
          {/* 服务描述 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-4">服务描述</Text>
            <Text className="block text-base text-gray-600 leading-relaxed">
              {service.description}
            </Text>
          </View>

          {/* 服务特点 */}
          {service.features && service.features.length > 0 && (
            <View
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
              }}
            >
              <Text className="block text-lg font-bold text-gray-800 mb-4">服务特点</Text>
              <View className="space-y-3">
                {service.features.map((feature, index) => (
                  <View key={index} className="flex flex-row items-start">
                    <View className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Info size={14} color="#10B981" />
                    </View>
                    <Text className="block flex-1 text-base text-gray-700 leading-relaxed">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 服务时长 */}
          {service.duration && (
            <View
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
              }}
            >
              <View className="flex flex-row items-center mb-4">
                <Clock size={20} color="#10B981" className="mr-2" />
                <Text className="block text-lg font-bold text-gray-800">服务时长</Text>
              </View>
              <Text className="block text-base text-gray-600">{service.duration}</Text>
            </View>
          )}

          {/* 服务保障 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-4">服务保障</Text>
            <View className="grid grid-cols-3 gap-4">
              <View className="text-center">
                <View className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Award size={24} color="#10B981" />
                </View>
                <Text className="block text-sm font-bold text-gray-800 mb-1">
                  专业团队
                </Text>
                <Text className="block text-xs text-gray-500">
                  经验丰富
                </Text>
              </View>
              <View className="text-center">
                <View className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={24} color="#10B981" />
                </View>
                <Text className="block text-sm font-bold text-gray-800 mb-1">
                  准时到达
                </Text>
                <Text className="block text-xs text-gray-500">
                  守时守信
                </Text>
              </View>
              <View className="text-center">
                <View className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Phone size={24} color="#10B981" />
                </View>
                <Text className="block text-sm font-bold text-gray-800 mb-1">
                  售后保障
                </Text>
                <Text className="block text-xs text-gray-500">
                  满意付款
                </Text>
              </View>
            </View>
          </View>

          {/* 联系方式 */}
          <View
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-6 text-center relative overflow-hidden"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            {/* 背景装饰 */}
            <View className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <View className="relative">
              <Text className="block text-lg font-bold text-white mb-2">
                需要帮助？
              </Text>
              <Text className="block text-sm text-emerald-100 mb-4">
                我们的服务团队随时为您服务
              </Text>
              <View
                className="bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 inline-block border border-white/30"
                onClick={handleContact}
              >
                <Text className="block text-base font-bold text-white">
                  400-888-8888
                </Text>
              </View>
            </View>
          </View>

          {/* 底部留白 */}
          <View className="h-32" />
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
          zIndex: 100,
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))'
        }}
      >
        <View
          className="flex-1 bg-white border border-emerald-500 rounded-2xl py-4 text-center"
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
          onClick={handleContact}
        >
          <Text className="block text-base font-bold text-emerald-600">
            联系客服
          </Text>
        </View>
        <View className="flex-2 flex-[2]">
          <View
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl py-4 text-base font-bold shadow-lg text-center"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35), 0 2px 4px rgba(16, 185, 129, 0.15)'
            }}
            onClick={handleBooking}
          >
            立即预约
          </View>
        </View>
      </View>
    </View>
  )
}

export default ServiceDetailPage

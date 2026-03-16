import { useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { Sparkles, House, Tv, LayoutGrid, Clock, MapPin, Check, Phone, ChevronRight, Star } from 'lucide-react-taro'
import './index.css'

interface ServiceDetail {
  id: string
  name: string
  description: string
  price: string
  duration: string
  icon: string
  features: string[]
  range: string[]
  image: string
}

const ServiceDetailPage = () => {
  const router = useRouter()
  const [service, setService] = useState<ServiceDetail | null>(null)

  useLoad(() => {
    const { id } = router.params
    if (id) {
      loadServiceDetail(id)
    }
  })

  const loadServiceDetail = (serviceId: string) => {
    // 服务详情数据
    const mockServices: Record<string, ServiceDetail> = {
      '1': {
        id: '1',
        name: '日常保洁',
        description: '地面清洁、桌面整理、卫生间清洁、厨房基础清洁、垃圾清理',
        price: '50元/小时',
        duration: '2小时起',
        icon: 'Sparkles',
        features: ['地面清洁', '桌面整理', '卫生间清洁', '厨房基础清洁', '垃圾清理'],
        range: ['客厅', '卧室', '厨房', '卫生间', '阳台'],
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop'
      },
      '2': {
        id: '2',
        name: '深度保洁',
        description: '日常保洁 + 玻璃擦拭、厨房重油污清洁、卫生间深度除垢、边角细节清洁',
        price: '100元/小时',
        duration: '4小时起',
        icon: 'Sparkles',
        features: ['日常保洁全部内容', '玻璃擦拭', '厨房重油污清洁', '卫生间深度除垢', '边角细节清洁'],
        range: ['客厅', '卧室', '厨房', '卫生间', '阳台', '窗户'],
        image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop'
      },
      '3': {
        id: '3',
        name: '新居开荒',
        description: '装修后全面清洁、灰尘清理、玻璃清洗、地面胶渍处理、全屋细节打扫',
        price: '8元/平米',
        duration: '全天',
        icon: 'House',
        features: ['装修后全面清洁', '灰尘清理', '玻璃清洗', '地面胶渍处理', '全屋细节打扫'],
        range: ['全屋区域', '窗户玻璃', '地面墙面', '厨房卫生间', '阳台露台'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
      },
      '4': {
        id: '4',
        name: '家电清洗',
        description: '空调清洗、油烟机清洗、洗衣机清洗、冰箱清洗',
        price: '80元/台起',
        duration: '1-2小时',
        icon: 'Tv',
        features: ['空调清洗', '油烟机清洗', '洗衣机清洗', '冰箱清洗'],
        range: ['空调', '油烟机', '洗衣机', '冰箱', '热水器'],
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop'
      },
      '5': {
        id: '5',
        name: '收纳整理',
        description: '衣柜整理、杂物分类、空间规划、居家物品归位',
        price: '200元/次',
        duration: '3小时起',
        icon: 'LayoutGrid',
        features: ['衣柜整理', '杂物分类', '空间规划', '居家物品归位'],
        range: ['衣柜', '书柜', '储物间', '厨房橱柜', '儿童房'],
        image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=400&fit=crop'
      }
    }
    
    setService(mockServices[serviceId] || mockServices['1'])
  }

  const getServiceIcon = (iconName: string, size: number = 32) => {
    const iconMap: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles size={size} color="#10B981" />,
      House: <House size={size} color="#10B981" />,
      Tv: <Tv size={size} color="#10B981" />,
      LayoutGrid: <LayoutGrid size={size} color="#10B981" />
    }
    return iconMap[iconName] || <Sparkles size={size} color="#10B981" />
  }

  const handleBooking = () => {
    if (service) {
      Taro.navigateTo({
        url: `/pages/booking/index?serviceId=${service.id}`
      })
    }
  }

  const handleCallService = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-9999',
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  }

  if (!service) {
    return (
      <View className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <Text className="block text-base text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView scrollY className="flex-1 pb-20">
        {/* 服务图片 */}
        <View className="relative">
          <Image
            className="w-full h-48"
            src={service.image}
            mode="aspectFill"
          />
          <View className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex flex-row items-center">
            {getServiceIcon(service.icon, 20)}
            <Text className="block text-sm font-medium text-gray-800 ml-2">{service.name}</Text>
          </View>
        </View>

        {/* 服务信息 */}
        <View className="bg-white -mt-4 rounded-t-3xl relative">
          <View className="px-4 pt-6 pb-4">
            {/* 价格和时长 */}
            <View className="flex flex-row items-end mb-4">
              <Text className="text-2xl font-bold text-emerald-500">{service.price}</Text>
              <Text className="text-sm text-gray-400 ml-2 mb-1">{service.duration}</Text>
            </View>

            {/* 服务描述 */}
            <Text className="block text-sm text-gray-600 leading-relaxed">{service.description}</Text>
          </View>

          {/* 服务内容 */}
          <View className="px-4 py-4 border-t border-gray-100">
            <Text className="block text-base font-semibold text-gray-800 mb-3">服务内容</Text>
            <View className="flex flex-col gap-2">
              {service.features.map((feature, index) => (
                <View key={index} className="flex flex-row items-center">
                  <View className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <Check size={12} color="#10B981" />
                  </View>
                  <Text className="block text-sm text-gray-600">{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 服务范围 */}
          <View className="px-4 py-4 border-t border-gray-100">
            <Text className="block text-base font-semibold text-gray-800 mb-3">服务范围</Text>
            <View className="flex flex-row flex-wrap gap-2">
              {service.range.map((item, index) => (
                <View key={index} className="bg-gray-100 rounded-full px-3 py-1">
                  <Text className="block text-sm text-gray-600">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 服务说明 */}
          <View className="px-4 py-4 border-t border-gray-100">
            <Text className="block text-base font-semibold text-gray-800 mb-3">服务说明</Text>
            <View className="flex flex-col gap-3">
              <View className="flex flex-row items-start">
                <Clock size={16} color="#9CA3AF" className="mt-0.5" />
                <View className="ml-3 flex-1">
                  <Text className="block text-sm text-gray-500">服务时长：{service.duration}</Text>
                </View>
              </View>
              <View className="flex flex-row items-start">
                <MapPin size={16} color="#9CA3AF" className="mt-0.5" />
                <View className="ml-3 flex-1">
                  <Text className="block text-sm text-gray-500">服务区域：全市范围</Text>
                </View>
              </View>
              <View className="flex flex-row items-start">
                <Star size={16} color="#9CA3AF" className="mt-0.5" />
                <View className="ml-3 flex-1">
                  <Text className="block text-sm text-gray-500">服务保障：不满意免费返工</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 联系客服 */}
          <View className="px-4 py-4 border-t border-gray-100">
            <View 
              className="bg-emerald-50 rounded-xl p-4 flex flex-row items-center justify-between"
              onClick={handleCallService}
            >
              <View className="flex flex-row items-center">
                <Phone size={20} color="#10B981" />
                <View className="ml-3">
                  <Text className="block text-sm font-medium text-gray-800">需要帮助？联系客服</Text>
                  <Text className="block text-xs text-gray-500 mt-1">400-888-9999</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部预约按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <View className="flex flex-row items-center gap-3">
          <View 
            className="flex flex-col items-center justify-center px-4"
            onClick={handleCallService}
          >
            <Phone size={20} color="#10B981" />
            <Text className="block text-xs text-gray-500 mt-1">客服</Text>
          </View>
          <View 
            className="flex-1 bg-emerald-500 text-white text-center py-3 rounded-xl font-medium"
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

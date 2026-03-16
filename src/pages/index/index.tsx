import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { Sparkles, House, Tv, LayoutGrid, ChevronRight, Phone, FileText, User } from 'lucide-react-taro'
import { useState } from 'react'
import './index.css'

// 服务类型定义
interface ServiceType {
  id: string
  name: string
  description: string
  price: string
  duration: string
  icon: string
  features: string[]
}

// 轮播图类型
interface BannerItem {
  id: string
  image: string
  title: string
}

const IndexPage = () => {
  useLoad(() => {
    console.log('🏠 首页加载')
  })

  const [services] = useState<ServiceType[]>([
    {
      id: '1',
      name: '日常保洁',
      description: '地面清洁、桌面整理、卫生间清洁、厨房基础清洁、垃圾清理',
      price: '50元/小时',
      duration: '2小时起',
      icon: 'Sparkles',
      features: ['地面清洁', '桌面整理', '卫生间清洁', '厨房基础清洁', '垃圾清理']
    },
    {
      id: '2',
      name: '深度保洁',
      description: '日常保洁 + 玻璃擦拭、厨房重油污清洁、卫生间深度除垢、边角细节清洁',
      price: '100元/小时',
      duration: '4小时起',
      icon: 'Sparkles',
      features: ['日常保洁全部内容', '玻璃擦拭', '厨房重油污清洁', '卫生间深度除垢', '边角细节清洁']
    },
    {
      id: '3',
      name: '新居开荒',
      description: '装修后全面清洁、灰尘清理、玻璃清洗、地面胶渍处理、全屋细节打扫',
      price: '8元/平米',
      duration: '全天',
      icon: 'House',
      features: ['装修后全面清洁', '灰尘清理', '玻璃清洗', '地面胶渍处理', '全屋细节打扫']
    },
    {
      id: '4',
      name: '家电清洗',
      description: '空调清洗、油烟机清洗、洗衣机清洗、冰箱清洗',
      price: '80元/台起',
      duration: '1-2小时',
      icon: 'Tv',
      features: ['空调清洗', '油烟机清洗', '洗衣机清洗', '冰箱清洗']
    },
    {
      id: '5',
      name: '收纳整理',
      description: '衣柜整理、杂物分类、空间规划、居家物品归位',
      price: '200元/次',
      duration: '3小时起',
      icon: 'LayoutGrid',
      features: ['衣柜整理', '杂物分类', '空间规划', '居家物品归位']
    }
  ])

  // 轮播图数据
  const [banners] = useState<BannerItem[]>([
    { id: '1', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop', title: '专业家政服务' },
    { id: '2', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop', title: '深度清洁专家' },
    { id: '3', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop', title: '新居开荒首选' }
  ])

  // 获取服务图标
  const getServiceIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles size={28} color="#fff" />,
      House: <House size={28} color="#fff" />,
      Tv: <Tv size={28} color="#fff" />,
      LayoutGrid: <LayoutGrid size={28} color="#fff" />
    }
    return iconMap[iconName] || <Sparkles size={28} color="#fff" />
  }

  // 跳转到服务详情
  const handleServiceClick = (service: ServiceType) => {
    Taro.navigateTo({
      url: `/pages/service-detail/index?id=${service.id}`
    })
  }

  // 跳转到预约页面
  const handleBooking = (serviceId?: string) => {
    if (serviceId) {
      Taro.navigateTo({
        url: `/pages/booking/index?serviceId=${serviceId}`
      })
    } else {
      Taro.navigateTo({
        url: '/pages/booking/index'
      })
    }
  }

  // 拨打客服电话
  const handleCallService = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-9999',
      fail: () => {
        Taro.showToast({
          title: '拨打失败',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 轮播图 */}
      <View className="px-4 pt-4">
        <Swiper
          className="h-40 rounded-2xl overflow-hidden"
          indicatorDots
          autoplay
          interval={3000}
          duration={500}
          indicatorColor="rgba(255,255,255,0.5)"
          indicatorActiveColor="#10B981"
        >
          {banners.map(banner => (
            <SwiperItem key={banner.id}>
              <Image
                className="w-full h-full"
                src={banner.image}
                mode="aspectFill"
              />
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 py-4">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <View className="flex flex-row justify-around">
            <View 
              className="flex flex-col items-center" 
              onClick={() => handleBooking()}
            >
              <View className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-2">
                <Sparkles size={24} color="#fff" />
              </View>
              <Text className="block text-sm text-gray-700">立即预约</Text>
            </View>
            <View 
              className="flex flex-col items-center"
              onClick={() => Taro.switchTab({ url: '/pages/orders/index' })}
            >
              <View className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2">
                <FileText size={24} color="#fff" />
              </View>
              <Text className="block text-sm text-gray-700">我的预约</Text>
            </View>
            <View 
              className="flex flex-col items-center"
              onClick={handleCallService}
            >
              <View className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-2">
                <Phone size={24} color="#fff" />
              </View>
              <Text className="block text-sm text-gray-700">客服电话</Text>
            </View>
            <View 
              className="flex flex-col items-center"
              onClick={() => Taro.switchTab({ url: '/pages/profile/index' })}
            >
              <View className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-2">
                <User size={24} color="#fff" />
              </View>
              <Text className="block text-sm text-gray-700">个人中心</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 服务列表 */}
      <View className="px-4 pb-4">
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="block text-lg font-bold text-gray-800">服务项目</Text>
        </View>

        <View className="flex flex-col gap-3">
          {services.map(service => (
            <View
              key={service.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              onClick={() => handleServiceClick(service)}
            >
              <View className="flex flex-row items-center">
                <View className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center">
                  {getServiceIcon(service.icon)}
                </View>
                <View className="ml-3 flex-1">
                  <Text className="block text-base font-semibold text-gray-800">{service.name}</Text>
                  <Text className="block text-sm text-gray-500 mt-1 line-clamp-1">{service.description}</Text>
                  <View className="flex flex-row items-center mt-2">
                    <Text className="text-emerald-500 font-bold">{service.price}</Text>
                    <Text className="text-gray-400 text-xs ml-2">{service.duration}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 底部客服信息 */}
      <View className="px-4 pb-6">
        <View className="bg-emerald-50 rounded-2xl p-4">
          <View className="flex flex-row items-center justify-between">
            <View>
              <Text className="block text-base font-semibold text-gray-800">需要帮助？</Text>
              <Text className="block text-sm text-gray-500 mt-1">客服热线：400-888-9999</Text>
              <Text className="block text-xs text-gray-400 mt-1">服务时间：08:00-22:00</Text>
            </View>
            <View 
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl"
              onClick={handleCallService}
            >
              <Text className="text-sm font-medium">立即咨询</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default IndexPage

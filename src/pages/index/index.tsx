import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { Sparkles, House, Tv, LayoutGrid, ChevronRight, Phone, FileText, User, Search } from 'lucide-react-taro'
import { useState } from 'react'
import './index.css'

// 服务类型定义
interface ServiceType {
  id: string
  name: string
  description: string
  price: string
  unit: string
  duration: string
  icon: string
  features: string[]
  color: string // 每个服务的专属颜色
}

// 轮播图类型
interface BannerItem {
  id: string
  image: string
  title: string
}

// 分类入口类型
interface CategoryItem {
  id: string
  name: string
  icon: string
  color: string
  serviceIds: string[]
}

const IndexPage = () => {
  useLoad(() => {
    console.log('🏠 首页加载')
  })

  // 服务数据 - 每个服务有专属颜色
  const [services] = useState<ServiceType[]>([
    {
      id: '1',
      name: '日常保洁',
      description: '地面清洁、桌面整理、卫生间清洁、厨房基础清洁、垃圾清理',
      price: '50',
      unit: '元/小时',
      duration: '2小时起',
      icon: 'Sparkles',
      color: '#F85659', // 红色
      features: ['地面清洁', '桌面整理', '卫生间清洁', '厨房基础清洁', '垃圾清理']
    },
    {
      id: '2',
      name: '深度保洁',
      description: '日常保洁 + 玻璃擦拭、厨房重油污清洁、卫生间深度除垢、边角细节清洁',
      price: '100',
      unit: '元/小时',
      duration: '4小时起',
      icon: 'Sparkles',
      color: '#007CFF', // 蓝色
      features: ['日常保洁全部内容', '玻璃擦拭', '厨房重油污清洁', '卫生间深度除垢', '边角细节清洁']
    },
    {
      id: '3',
      name: '新居开荒',
      description: '装修后全面清洁、灰尘清理、玻璃清洗、地面胶渍处理、全屋细节打扫',
      price: '8',
      unit: '元/平米',
      duration: '全天',
      icon: 'House',
      color: '#5DC801', // 绿色
      features: ['装修后全面清洁', '灰尘清理', '玻璃清洗', '地面胶渍处理', '全屋细节打扫']
    },
    {
      id: '4',
      name: '家电清洗',
      description: '空调清洗、油烟机清洗、洗衣机清洗、冰箱清洗',
      price: '80',
      unit: '元/台起',
      duration: '1-2小时',
      icon: 'Tv',
      color: '#F38F00', // 橙色
      features: ['空调清洗', '油烟机清洗', '洗衣机清洗', '冰箱清洗']
    },
    {
      id: '5',
      name: '收纳整理',
      description: '衣柜整理、杂物分类、空间规划、居家物品归位',
      price: '200',
      unit: '元/次',
      duration: '3小时起',
      icon: 'LayoutGrid',
      color: '#9B40D8', // 紫色
      features: ['衣柜整理', '杂物分类', '空间规划', '居家物品归位']
    }
  ])

  // 分类入口数据
  const [categories] = useState<CategoryItem[]>([
    { id: 'cleaning', name: '保洁服务', icon: 'Sparkles', color: '#F85659', serviceIds: ['1', '2'] },
    { id: 'deep', name: '新居开荒', icon: 'House', color: '#5DC801', serviceIds: ['3'] },
    { id: 'appliance', name: '家电清洗', icon: 'Tv', color: '#F38F00', serviceIds: ['4'] },
    { id: 'organize', name: '收纳整理', icon: 'LayoutGrid', color: '#9B40D8', serviceIds: ['5'] }
  ])

  // 轮播图数据
  const [banners] = useState<BannerItem[]>([
    { id: '1', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop', title: '专业家政服务' },
    { id: '2', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop', title: '深度清洁专家' },
    { id: '3', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop', title: '新居开荒首选' }
  ])

  // 获取服务图标
  const getServiceIcon = (iconName: string, color: string = '#fff') => {
    const iconMap: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles size={24} color={color} />,
      House: <House size={24} color={color} />,
      Tv: <Tv size={24} color={color} />,
      LayoutGrid: <LayoutGrid size={24} color={color} />
    }
    return iconMap[iconName] || <Sparkles size={24} color={color} />
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

  // 分类点击
  const handleCategoryClick = (category: CategoryItem) => {
    // 跳转到第一个服务
    if (category.serviceIds.length > 0) {
      handleServiceClick(services.find(s => s.id === category.serviceIds[0])!)
    }
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 搜索栏 */}
      <View className="px-4 pt-4 pb-2">
        <View 
          className="flex flex-row items-center bg-white rounded-full px-4 py-3"
          style={{ border: '1px solid #EDEDED' }}
          onClick={() => Taro.showToast({ title: '搜索功能开发中', icon: 'none' })}
        >
          <Search size={20} color="#B3B3B3" />
          <Text className="ml-2 text-sm" style={{ color: '#B3B3B3' }}>搜索服务...</Text>
        </View>
      </View>

      {/* 轮播图 */}
      <View className="px-4 py-2">
        <Swiper
          className="h-40 rounded-2xl overflow-hidden"
          indicatorDots
          autoplay
          interval={3000}
          duration={500}
          indicatorColor="rgba(255,255,255,0.5)"
          indicatorActiveColor="#F85659"
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

      {/* 分类入口网格 - 参考 design006.com 的分类展示 */}
      <View className="px-4 py-4">
        <View className="flex flex-row flex-wrap gap-3">
          {categories.map(category => (
            <View
              key={category.id}
              className="flex-1 min-w-[45%] bg-white rounded-2xl p-4"
              style={{ border: '1px solid #EDEDED' }}
              onClick={() => handleCategoryClick(category)}
            >
              <View className="flex flex-row items-center">
                <View 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  {getServiceIcon(category.icon)}
                </View>
                <Text 
                  className="ml-3 text-sm font-medium"
                  style={{ color: '#2E2E30' }}
                >
                  {category.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 pb-4">
        <View 
          className="bg-white rounded-2xl p-4"
          style={{ border: '1px solid #EDEDED' }}
        >
          <View className="flex flex-row justify-around">
            <View 
              className="flex flex-col items-center" 
              onClick={() => handleBooking()}
            >
              <View 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: '#F85659' }}
              >
                <Sparkles size={24} color="#fff" />
              </View>
              <Text className="block text-sm" style={{ color: '#2E2E30' }}>立即预约</Text>
            </View>
            <View 
              className="flex flex-col items-center"
              onClick={() => Taro.switchTab({ url: '/pages/orders/index' })}
            >
              <View 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: '#007CFF' }}
              >
                <FileText size={24} color="#fff" />
              </View>
              <Text className="block text-sm" style={{ color: '#2E2E30' }}>我的预约</Text>
            </View>
            <View 
              className="flex flex-col items-center"
              onClick={handleCallService}
            >
              <View 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: '#F38F00' }}
              >
                <Phone size={24} color="#fff" />
              </View>
              <Text className="block text-sm" style={{ color: '#2E2E30' }}>客服电话</Text>
            </View>
            <View 
              className="flex flex-col items-center"
              onClick={() => Taro.switchTab({ url: '/pages/profile/index' })}
            >
              <View 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: '#9B40D8' }}
              >
                <User size={24} color="#fff" />
              </View>
              <Text className="block text-sm" style={{ color: '#2E2E30' }}>个人中心</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 服务列表 */}
      <View className="px-4 pb-4">
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="block text-lg font-bold" style={{ color: '#2E2E30' }}>热门服务</Text>
        </View>

        <View className="flex flex-col gap-3">
          {services.map(service => (
            <View
              key={service.id}
              className="bg-white rounded-2xl p-4"
              style={{ border: '1px solid #EDEDED' }}
              onClick={() => handleServiceClick(service)}
            >
              <View className="flex flex-row items-center">
                {/* 服务图标 - 使用专属颜色 */}
                <View 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: service.color }}
                >
                  {getServiceIcon(service.icon)}
                </View>
                <View className="ml-3 flex-1">
                  <Text 
                    className="block text-base font-semibold"
                    style={{ color: '#2E2E30' }}
                  >
                    {service.name}
                  </Text>
                  <Text 
                    className="block text-sm mt-1 line-clamp-1"
                    style={{ color: '#B3B3B3' }}
                  >
                    {service.description}
                  </Text>
                  <View className="flex flex-row items-center mt-2">
                    <Text 
                      className="font-bold"
                      style={{ color: service.color }}
                    >
                      ¥{service.price}
                    </Text>
                    <Text 
                      className="text-xs ml-1"
                      style={{ color: '#B3B3B3' }}
                    >
                      {service.unit}
                    </Text>
                    <Text 
                      className="text-xs ml-2"
                      style={{ color: '#B3B3B3' }}
                    >
                      {service.duration}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#B3B3B3" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 底部客服信息 */}
      <View className="px-4 pb-6">
        <View 
          className="rounded-2xl p-4"
          style={{ backgroundColor: '#FFF7F7' }}
        >
          <View className="flex flex-row items-center justify-between">
            <View>
              <Text 
                className="block text-base font-semibold"
                style={{ color: '#2E2E30' }}
              >
                需要帮助？
              </Text>
              <Text 
                className="block text-sm mt-1"
                style={{ color: '#B3B3B3' }}
              >
                客服热线：400-888-9999
              </Text>
              <Text 
                className="block text-xs mt-1"
                style={{ color: '#B3B3B3' }}
              >
                服务时间：08:00-22:00
              </Text>
            </View>
            <View 
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#F85659' }}
              onClick={handleCallService}
            >
              <Text className="text-sm font-medium text-white">立即咨询</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default IndexPage

import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { 
  Sparkles, Wind, Droplets, House, Shirt, Box, 
  Sofa, Refrigerator, Tv, WashingMachine, Fan,
  Check, ChevronRight, Clock, Star
} from 'lucide-react-taro'
import './index.css'

// 服务类型配置
const SERVICE_CONFIG: Record<string, {
  title: string
  subtitle: string
  items: Array<{
    id: string
    name: string
    desc: string
    price: string
    unit: string
    duration: string
    icon: string
    popular?: boolean
  }>
}> = {
  // 保洁服务
  cleaning: {
    title: '保洁服务',
    subtitle: '专业保洁团队，让家焕然一新',
    items: [
      { id: 'daily', name: '日常保洁', desc: '日常清洁整理，保持家居整洁', price: '50', unit: '元/小时', duration: '2小时起', icon: 'Sparkles', popular: true },
      { id: 'deep', name: '深度保洁', desc: '全方位深度清洁，无死角', price: '80', unit: '元/小时', duration: '3小时起', icon: 'Droplets' },
      { id: 'kitchen', name: '厨房专项清洁', desc: '油烟机、灶台、橱柜深度清洁', price: '150', unit: '元/次', duration: '2-3小时', icon: 'Home' },
      { id: 'bathroom', name: '卫生间专项清洁', desc: '马桶、浴缸、瓷砖深度清洁', price: '120', unit: '元/次', duration: '1-2小时', icon: 'Droplets' }
    ]
  },
  // 家电清洗
  appliance: {
    title: '家电清洗',
    subtitle: '专业设备清洗，延长使用寿命',
    items: [
      { id: 'ac', name: '空调清洗', desc: '内外机深度清洗，杀菌消毒', price: '80', unit: '元/台', duration: '1小时', icon: 'Wind', popular: true },
      { id: 'washer', name: '洗衣机清洗', desc: '内桶除垢杀菌，告别异味', price: '100', unit: '元/台', duration: '1小时', icon: 'WashingMachine' },
      { id: 'fridge', name: '冰箱清洗', desc: '除霜除味杀菌，食材更安全', price: '120', unit: '元/台', duration: '1-2小时', icon: 'Refrigerator' },
      { id: 'range', name: '油烟机清洗', desc: '深度除油，恢复吸力', price: '150', unit: '元/台', duration: '1-2小时', icon: 'Fan' },
      { id: 'tv', name: '电视机清洁', desc: '屏幕除尘杀菌，延长寿命', price: '60', unit: '元/台', duration: '30分钟', icon: 'Tv' }
    ]
  },
  // 新居开荒
  newhouse: {
    title: '新居开荒',
    subtitle: '装修后首次清洁，专业彻底',
    items: [
      { id: 'one', name: '一居室开荒', desc: '适合50㎡以下房源', price: '300', unit: '元/套', duration: '4-6小时', icon: 'Home' },
      { id: 'two', name: '二居室开荒', desc: '适合50-80㎡房源', price: '450', unit: '元/套', duration: '6-8小时', icon: 'Home', popular: true },
      { id: 'three', name: '三居室开荒', desc: '适合80-120㎡房源', price: '600', unit: '元/套', duration: '8-10小时', icon: 'Home' },
      { id: 'villa', name: '别墅/复式开荒', desc: '适合120㎡以上房源', price: '1000', unit: '元/套起', duration: '1-2天', icon: 'Home' }
    ]
  },
  // 收纳整理
  organize: {
    title: '收纳整理',
    subtitle: '专业收纳师，让空间翻倍',
    items: [
      { id: 'wardrobe', name: '衣橱整理', desc: '衣物分类收纳，空间最大化', price: '200', unit: '元/次', duration: '2-3小时', icon: 'Shirt', popular: true },
      { id: 'whole', name: '全屋整理', desc: '全屋物品规划收纳', price: '500', unit: '元/次起', duration: '半天', icon: 'Box' },
      { id: 'move', name: '搬家整理', desc: '搬家前后物品整理收纳', price: '800', unit: '元/次起', duration: '1天', icon: 'Sofa' }
    ]
  }
}

const ServiceSelectPage = () => {
  const [serviceType, setServiceType] = useState<string>('cleaning')
  const [config, setConfig] = useState(SERVICE_CONFIG.cleaning)

  useEffect(() => {
    // 获取路由参数
    const instance = Taro.getCurrentInstance()
    const type = instance.router?.params?.type || 'cleaning'
    setServiceType(type)
    
    if (SERVICE_CONFIG[type]) {
      setConfig(SERVICE_CONFIG[type])
      // 设置页面标题
      Taro.setNavigationBarTitle({ title: SERVICE_CONFIG[type].title })
    }
  }, [])

  // 获取图标组件
  const getIcon = (iconName: string, size = 32, color = '#F85659') => {
    const iconMap: Record<string, JSX.Element> = {
      Sparkles: <Sparkles size={size} color={color} />,
      Wind: <Wind size={size} color={color} />,
      Droplets: <Droplets size={size} color={color} />,
      Home: <House size={size} color={color} />,
      Shirt: <Shirt size={size} color={color} />,
      Box: <Box size={size} color={color} />,
      Sofa: <Sofa size={size} color={color} />,
      Refrigerator: <Refrigerator size={size} color={color} />,
      Tv: <Tv size={size} color={color} />,
      WashingMachine: <WashingMachine size={size} color={color} />,
      Fan: <Fan size={size} color={color} />
    }
    return iconMap[iconName] || <Sparkles size={size} color={color} />
  }

  // 选择服务项目，跳转到预约页
  const handleSelectItem = (item: any) => {
    Taro.navigateTo({
      url: `/pages/service-book/index?type=${serviceType}&itemId=${item.id}&name=${encodeURIComponent(item.name)}&price=${item.price}&unit=${encodeURIComponent(item.unit)}&duration=${encodeURIComponent(item.duration)}`
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部信息 */}
      <View className="bg-white px-4 py-5 mb-3">
        <Text className="block text-xl font-bold text-gray-900 mb-1">{config.title}</Text>
        <Text className="block text-sm text-gray-500">{config.subtitle}</Text>
      </View>

      {/* 服务列表 */}
      <ScrollView scrollY className="service-list-wrapper">
        <View className="px-4 pb-6">
          {config.items.map(item => (
            <View 
              key={item.id}
              className="bg-white rounded-xl mb-3 overflow-hidden shadow-sm"
              onClick={() => handleSelectItem(item)}
            >
              <View className="flex flex-row p-4">
                {/* 图标 */}
                <View className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center mr-3 flex-shrink-0">
                  {getIcon(item.icon)}
                </View>

                {/* 内容 */}
                <View className="flex-1 min-w-0">
                  <View className="flex flex-row items-center mb-1">
                    <Text className="text-base font-semibold text-gray-900 mr-2">{item.name}</Text>
                    {item.popular && (
                      <View className="px-2 py-0.5 bg-red-500 rounded">
                        <Text className="text-xs text-white">热门</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-gray-500 mb-2">{item.desc}</Text>
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center">
                      <Clock size={12} color="#999" />
                      <Text className="text-xs text-gray-400 ml-1">{item.duration}</Text>
                    </View>
                    <View className="flex flex-row items-baseline">
                      <Text className="text-lg font-bold text-red-500">¥{item.price}</Text>
                      <Text className="text-xs text-gray-400 ml-1">/{item.unit}</Text>
                    </View>
                  </View>
                </View>

                {/* 箭头 */}
                <View className="flex items-center ml-2">
                  <ChevronRight size={20} color="#ccc" />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 服务保障 */}
        <View className="px-4 pb-8">
          <View className="bg-white rounded-xl p-4">
            <Text className="block text-base font-semibold text-gray-900 mb-3">服务保障</Text>
            <View className="flex flex-row justify-around">
              <View className="flex flex-col items-center">
                <View className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <Check size={20} color="#007CFF" />
                </View>
                <Text className="text-xs text-gray-600">专业团队</Text>
              </View>
              <View className="flex flex-col items-center">
                <View className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <Check size={20} color="#10B981" />
                </View>
                <Text className="text-xs text-gray-600">品质保障</Text>
              </View>
              <View className="flex flex-col items-center">
                <View className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                  <Star size={20} color="#F59E0B" />
                </View>
                <Text className="text-xs text-gray-600">满意为止</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ServiceSelectPage

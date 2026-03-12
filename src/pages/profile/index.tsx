import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { User, Phone, MapPin, Settings, FileText, Award, ChevronRight } from 'lucide-react-taro'
import './index.css'

const ProfilePage = () => {
  useLoad(() => {
    console.log('Profile page loaded')
  })

  const menuItems = [
    {
      icon: <FileText size={22} color="#10B981" />,
      title: '我的订单',
      subtitle: '查看预约记录',
      action: () => {
        Taro.switchTab({ url: '/pages/orders/index' })
      }
    },
    {
      icon: <MapPin size={22} color="#10B981" />,
      title: '地址管理',
      subtitle: '管理服务地址',
      action: () => {
        alert('地址管理功能开发中')
      }
    },
    {
      icon: <Phone size={22} color="#10B981" />,
      title: '联系客服',
      subtitle: '在线客服咨询',
      action: () => {
        alert('联系客服功能开发中')
      }
    },
    {
      icon: <Settings size={22} color="#10B981" />,
      title: '订单管理',
      subtitle: '自动接单/派单',
      action: () => {
        Taro.navigateTo({ url: '/pages/admin/index' })
      }
    },
    {
      icon: <Award size={22} color="#10B981" />,
      title: '会员中心',
      subtitle: '查看会员权益',
      action: () => {
        alert('会员中心功能开发中')
      }
    },
    {
      icon: <User size={22} color="#10B981" />,
      title: '帮助中心',
      subtitle: '常见问题解答',
      action: () => {
        alert('帮助中心功能开发中')
      }
    },
    {
      icon: <Settings size={22} color="#10B981" />,
      title: '设置',
      subtitle: '账户设置',
      action: () => {
        alert('设置功能开发中')
      }
    }
  ]

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 用户信息头部 - 多层渐变 + 装饰 */}
        <View className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 pt-12 pb-10 px-6">
          {/* 背景装饰 */}
          <View className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <View className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <View className="relative">
            <View className="flex flex-row items-center mb-6">
              {/* 头像 */}
              <View
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-5"
                style={{
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                }}
              >
                <User size={44} color="#fff" />
              </View>

              {/* 用户信息 */}
              <View className="flex-1">
                <Text className="block text-3xl font-bold text-white mb-2 leading-tight">
                  用户中心
                </Text>
                <Text className="block text-base text-emerald-100 font-medium">
                  享受专业家居服务
                </Text>
              </View>
            </View>

            {/* 统计数据 - 玻璃态卡片 */}
            <View className="bg-white/20 backdrop-blur-md rounded-3xl py-5 border border-white/30">
              <View className="flex flex-row justify-around">
                <View className="text-center">
                  <Text className="block text-3xl font-bold text-white mb-1">0</Text>
                  <Text className="block text-xs text-emerald-100 font-medium">全部订单</Text>
                </View>
                <View className="w-px bg-white/30" />
                <View className="text-center">
                  <Text className="block text-3xl font-bold text-white mb-1">0</Text>
                  <Text className="block text-xs text-emerald-100 font-medium">待服务</Text>
                </View>
                <View className="w-px bg-white/30" />
                <View className="text-center">
                  <Text className="block text-3xl font-bold text-white mb-1">0</Text>
                  <Text className="block text-xs text-emerald-100 font-medium">已完成</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 功能菜单 - 精致卡片 */}
        <View className="px-4 py-6">
          <View
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            {menuItems.map((item, index) => (
              <View
                key={index}
                className={`flex flex-row items-center px-6 py-5 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
                onClick={item.action}
                style={{
                  transition: 'all 0.2s ease'
                }}
              >
                {/* 图标容器 */}
                <View
                  className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mr-4"
                  style={{
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.08)'
                  }}
                >
                  {item.icon}
                </View>

                {/* 文字内容 */}
                <View className="flex-1">
                  <Text className="block text-lg font-bold text-gray-800 mb-0.5">
                    {item.title}
                  </Text>
                  <Text className="block text-sm text-gray-500">
                    {item.subtitle}
                  </Text>
                </View>

                {/* 箭头 */}
                <View className="w-8 h-8 flex items-center justify-center">
                  <ChevronRight size={20} color="#D1D5DB" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 服务优势 - 精致卡片 */}
        <View className="px-4 pb-6">
          <View
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-5">
              服务优势
            </Text>
            <View className="grid grid-cols-3 gap-4">
              <View className="text-center">
                <View
                  className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-3"
                  style={{
                    boxShadow: '0 4px 8px rgba(16, 185, 129, 0.12)'
                  }}
                >
                  <Award size={28} color="#10B981" />
                </View>
                <Text className="block text-sm font-bold text-gray-800 mb-1">
                  专业团队
                </Text>
                <Text className="block text-xs text-gray-500">
                  经验丰富
                </Text>
              </View>
              <View className="text-center">
                <View
                  className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-3"
                  style={{
                    boxShadow: '0 4px 8px rgba(16, 185, 129, 0.12)'
                  }}
                >
                  <Phone size={28} color="#10B981" />
                </View>
                <Text className="block text-sm font-bold text-gray-800 mb-1">
                  快速响应
                </Text>
                <Text className="block text-xs text-gray-500">
                  及时服务
                </Text>
              </View>
              <View className="text-center">
                <View
                  className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-3"
                  style={{
                    boxShadow: '0 4px 8px rgba(16, 185, 129, 0.12)'
                  }}
                >
                  <User size={28} color="#10B981" />
                </View>
                <Text className="block text-sm font-bold text-gray-800 mb-1">
                  优质保障
                </Text>
                <Text className="block text-xs text-gray-500">
                  品质保证
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 联系方式 - 渐变卡片 */}
        <View className="px-4 pb-8">
          <View
            className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-3xl p-6 text-center relative overflow-hidden"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            {/* 背景装饰 */}
            <View className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <View className="absolute bottom-[-10px] left-[-10px] w-16 h-16 bg-white/10 rounded-full blur-xl" />

            <View className="relative">
              <Text className="block text-lg font-bold text-white mb-2">
                需要帮助？
              </Text>
              <Text className="block text-sm text-emerald-100 mb-4">
                我们的服务团队随时为您服务
              </Text>
              <View
                className="bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 inline-block border border-white/30"
              >
                <Text className="block text-base font-bold text-white">
                  400-888-8888
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
